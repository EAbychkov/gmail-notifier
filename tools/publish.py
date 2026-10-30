#!/usr/bin/env python3
"""Publishes Mail Deck to the Chrome Web Store through its V2 API, as a service account.

  tools/publish.py status             the live version, the one in review, the last upload
  tools/publish.py upload             package the manifest's version and upload it as a draft
  tools/publish.py submit [--staged]  upload it and send it to review; --staged keeps it back
                                      after approval until it is published from the dashboard

Once per machine:
  ~/.config/mail-deck/cws-key.json  the service account's JSON key, chmod 600
  ~/.config/mail-deck/cws.env       CWS_PUBLISHER_ID=<Developer Dashboard, Publisher > Settings>
The service account's email is added in the Developer Dashboard, under Account.
"""
import base64
import json
import os
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG = os.path.expanduser('~/.config/mail-deck')
ITEM = 'hjlkjemogfgkpbbnogihekjcdmafecff'
SCOPE = 'https://www.googleapis.com/auth/chromewebstore'
API = 'https://chromewebstore.googleapis.com'


def fail(text):
    sys.exit('publish: ' + text)


def publisher():
    env = {}
    try:
        with open(os.path.join(CONFIG, 'cws.env')) as f:
            for line in f:
                k, _, v = line.strip().partition('=')
                env[k] = v.strip('"\'')
    except FileNotFoundError:
        pass
    pid = os.environ.get('CWS_PUBLISHER_ID') or env.get('CWS_PUBLISHER_ID')
    if not pid:
        fail(f'no CWS_PUBLISHER_ID in {CONFIG}/cws.env')
    return pid


def request(url, data=None, headers=None, method='POST'):
    req = urllib.request.Request(url, data=data, headers=headers or {}, method=method)
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            body = r.read()
    except urllib.error.HTTPError as e:
        fail(f'{method} {url} -> {e.code}\n{e.read().decode(errors="replace")}')
    return json.loads(body) if body else {}


# a JWT signed with the key buys an hour-long access token; openssl signs it, the key goes in on stdin
def token():
    try:
        with open(os.path.join(CONFIG, 'cws-key.json')) as f:
            key = json.load(f)
    except FileNotFoundError:
        fail(f'no service account key at {CONFIG}/cws-key.json')
    b64 = lambda b: base64.urlsafe_b64encode(b).rstrip(b'=')
    now = int(time.time())
    claims = {'iss': key['client_email'], 'scope': SCOPE, 'aud': key['token_uri'], 'iat': now, 'exp': now + 600}
    unsigned = b64(json.dumps({'alg': 'RS256', 'typ': 'JWT'}).encode()) + b'.' + b64(json.dumps(claims).encode())
    with tempfile.NamedTemporaryFile() as data:
        data.write(unsigned)
        data.flush()
        sig = subprocess.run(['openssl', 'dgst', '-sha256', '-sign', '/dev/stdin', data.name],
                             input=key['private_key'].encode(), capture_output=True, check=True).stdout
    form = urllib.parse.urlencode({
        'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        'assertion': (unsigned + b'.' + b64(sig)).decode()
    }).encode()
    return request(key['token_uri'], form, {'Content-Type': 'application/x-www-form-urlencoded'})['access_token']


def manifest_version():
    with open(os.path.join(ROOT, 'extension', 'manifest.json')) as f:
        return json.load(f)['version']


def fetch_status(auth, name):
    return request(f'{API}/v2/{name}:fetchStatus', headers=auth, method='GET')


def show(status):
    def revision(label, rev):
        if not rev:
            print(f'{label:10} -')
            return
        channels = ', '.join(f"{c.get('crxVersion', '?')} at {c.get('deployPercentage', '?')}%"
                             for c in rev.get('distributionChannels', [])) or 'no channels'
        print(f"{label:10} {rev.get('state', '?')}: {channels}")
    revision('live', status.get('publishedItemRevisionStatus'))
    revision('in review', status.get('submittedItemRevisionStatus'))
    print(f"{'upload':10} {status.get('lastAsyncUploadState', '-')}")
    if status.get('takenDown') or status.get('warned'):
        print(f"WARNING   takenDown={status.get('takenDown')} warned={status.get('warned')}")


def upload(auth, name):
    version = manifest_version()
    known = [c.get('crxVersion') for key in ('publishedItemRevisionStatus', 'submittedItemRevisionStatus')
             for c in (fetch_status(auth, name).get(key) or {}).get('distributionChannels', [])]
    if version in known:
        fail(f'the store already has {version}; raise "version" in extension/manifest.json')
    path = subprocess.run([os.path.join(ROOT, 'tools', 'package.sh')], capture_output=True, text=True,
                          check=True).stdout.strip()
    with open(os.path.join(ROOT, path), 'rb') as f:
        zipped = f.read()
    print(f'uploading {path} ({len(zipped) // 1024} KB)')
    r = request(f'{API}/upload/v2/{name}:upload', zipped, {**auth, 'Content-Type': 'application/zip'})
    state = r.get('uploadState', '')
    # a large package is processed after the request returns
    for _ in range(40):
        if 'IN_PROGRESS' not in state:
            break
        time.sleep(3)
        state = fetch_status(auth, name).get('lastAsyncUploadState', '')
    if 'SUCCEEDED' not in state:
        fail(f'upload ended as {state or "?"}: {json.dumps(r)}')
    print(f'uploaded {version}')


def submit(auth, name, staged):
    upload(auth, name)
    r = request(f'{API}/v2/{name}:publish',
                json.dumps({'publishType': 'STAGED_PUBLISH' if staged else 'DEFAULT_PUBLISH'}).encode(),
                {**auth, 'Content-Type': 'application/json'})
    print(f"submitted: {r.get('state', '?')}")
    for w in (r.get('warningInfo') or {}).get('warnings', []):
        print(f"warning: {w.get('reason')}: {w.get('description')}")


def main(args):
    cmd = args[0] if args else 'status'
    if cmd not in ('status', 'upload', 'submit'):
        sys.exit(__doc__)
    name = f'publishers/{publisher()}/items/{ITEM}'
    auth = {'Authorization': 'Bearer ' + token()}
    if cmd == 'status':
        print(f'manifest   {manifest_version()}')
        show(fetch_status(auth, name))
    elif cmd == 'upload':
        upload(auth, name)
    else:
        submit(auth, name, '--staged' in args)


if __name__ == '__main__':
    main(sys.argv[1:])
