# Mail Deck for Gmail: privacy policy

Last updated: 2026-10-28

Mail Deck has no servers, no analytics and no tracking. Nothing it reads leaves your browser except the requests it sends to Gmail itself.

## What it reads

- **Unread mail.** Mail Deck reads the Gmail Atom feed (`mail.google.com/mail/u/N/feed/atom`) for each Google account you are signed in to in this browser. The browser sends your existing Google session cookies with those requests. Mail Deck never asks for, sees or stores your password.
- **Message text.** When you open a message in the panel, Mail Deck loads that message's print view from `mail.google.com` and shows it in the panel.
- **Gmail's action token.** To mark mail as read, archive, delete or report spam, Mail Deck reads the `GMAIL_AT` cookie that Gmail sets for `mail.google.com` and sends it back to `mail.google.com` with the action, the same way the Gmail web page does.
- **Gmail tab requests.** If "Check when Gmail tabs or the network change" is on in settings (it is by default), Mail Deck notices when a Gmail tab sends a request to `mail.google.com` so it can refresh the unread count. It does not read, block or change those requests.

## Where it goes

Only to `mail.google.com`. Mail Deck does not send your mail, addresses, cookies or settings to its author or to any other party. It does not sell or share data, and it does not use your data for advertising or credit decisions.

## What it stores

Your settings and the current unread counts are kept in the browser's extension storage (`chrome.storage`) on your device. Removing the extension deletes them.

## Contact

Questions or problems: open an issue at https://github.com/EAbychkov/mail-deck/issues.
