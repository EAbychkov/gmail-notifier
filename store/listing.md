# Chrome Web Store listing: Mail Deck for Gmail

Copy-paste fields for the Developer Dashboard (https://chrome.google.com/webstore/devconsole). Package: zip the contents of `extension/` (manifest.json at the zip root).

## Store listing tab

**Name** (from the manifest): Mail Deck for Gmail

**Summary** (from the manifest, 122 of 132 chars):

```
Unread mail from every Gmail account you are signed in to, in one panel. Read, archive or delete it without opening Gmail.
```

**Description:**

```
Mail Deck puts the unread mail of every Google account you're signed in to into one panel on the toolbar.

Click a message to read it in full right in the panel. You can mark it as read, archive it, delete it or report it as spam without opening a Gmail tab. Click a mailbox to open it in Gmail.

Features
- Every signed-in Gmail account, each with its own colour
- Light and dark theme, following your system
- Watch the inbox or chosen labels for each account
- Read, archive, delete or report spam from the panel
- Full message view inside the panel
- Desktop notifications and an optional sound for new mail
- Unread count on the toolbar icon

Privacy
Mail Deck has no servers of its own and no analytics. It talks only to mail.google.com, using the Google session your browser already has. It never asks for or stores your password, and your settings stay in your browser.

Mail Deck is open source under the Mozilla Public License 1.1: https://github.com/EAbychkov/mail-deck
It is not made by or affiliated with Google. Gmail is a trademark of Google LLC.
```

**Category:** Productivity → Communication

**Language:** English

**Store icon:** `extension/data/icons/red/128.png` (128×128)

**Screenshots:** `store/screenshot-1-inbox.png` … `screenshot-5-empty.png` (1280×800, in this order). **Small promo tile:** `store/promo-440x280.png`.

**Official URL / Homepage URL:** https://github.com/EAbychkov/mail-deck

**Support URL:** https://github.com/EAbychkov/mail-deck/issues

## Privacy tab

**Single purpose:**

```
Show unread Gmail messages from the Google accounts the user is signed in to in a toolbar panel, and let the user read, archive, delete or mark them as read from there.
```

**Permission justifications:**

| Permission | Justification |
|---|---|
| `notifications` | Shows a desktop notification when new mail arrives, with buttons to mark it as read, archive or delete it, and shows an error notice when an action or the alert sound fails. |
| `contextMenus` | Adds the right-click menu on the toolbar icon: open Gmail, refresh now, compose an email, turn notifications off for a while or for the session, and choose which accounts are included. |
| `webRequest` | Observes (never blocks or modifies) requests that the user's own Gmail tabs send to mail.google.com, so the unread count refreshes right after the user reads or archives mail in Gmail. The user can turn this off in settings. |
| `storage` | Saves the user's settings and the current unread counts and notification state in local extension storage. |
| `alarms` | Schedules the periodic mail check and removes old notifications after a set time. |
| `idle` | Lets the user mute notifications and sounds while away or while the screen is locked, and rechecks mail when the user comes back. |
| `offscreen` | Opens an offscreen document to play the new-mail sound and to parse Gmail's responses when performing actions, since the service worker has no audio or DOM. |
| `cookies` | Reads only the GMAIL_AT cookie of mail.google.com, the token Gmail's own web page sends with actions, so that mark as read, archive, delete and spam requests are accepted by Gmail. The value is sent only to mail.google.com. |
| Host `*://mail.google.com/mail/` | Reads the Gmail Atom feed of unread mail for each signed-in account, loads a message's print view to show its text, and sends the user's read/archive/delete/spam actions. |
| Host `*://mail.google.com/sync/` | Lets the webRequest observer above see Gmail's sync requests, so the count updates after the user acts in a Gmail tab. |

**Are you using remote code?** No, I am not using remote code. (All JavaScript ships in the package; nothing is loaded from a server or evaluated from strings.)

**Data usage — what user data do you collect?** The extension handles this data on the device and sends it only to mail.google.com. Tick:

- [x] Personally identifiable information (account email addresses and sender names and addresses shown in the panel)
- [x] Authentication information (the GMAIL_AT token read from the mail.google.com cookie)
- [x] Personal communications (email subjects, snippets and message text)
- [x] Website content (Gmail's feed and print-view pages it reads)
- [ ] Health information
- [ ] Financial and payment information
- [ ] Location
- [ ] Web history
- [ ] User activity

**Certifications (tick all three):**

- [x] I do not sell or transfer user data to third parties, outside of the approved use cases
- [x] I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- [x] I do not use or transfer user data to determine creditworthiness or for lending purposes

**Privacy policy URL:** https://github.com/EAbychkov/mail-deck/blob/main/PRIVACY.md

## Distribution tab

**Visibility:** Public. **Regions:** All regions. **Pricing:** Free.
