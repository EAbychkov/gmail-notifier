# Mail Deck for Gmail: privacy policy

Last updated: 2026-10-30

Mail Deck has no servers, no analytics and no tracking. Nothing it reads leaves your browser except the requests it sends to Google itself.

## What it reads

- **Unread mail.** Mail Deck reads the Gmail Atom feed (`mail.google.com/mail/u/N/feed/atom`) for each Google account you are signed in to in this browser. The browser sends your existing Google session cookies with those requests. Mail Deck never asks for, sees or stores your password.
- **Message text.** When you open a message in the panel, Mail Deck loads that conversation's print view from `mail.google.com` and shows it in the panel, with links to its attachments.
- **Gmail search.** When the panel opens, Mail Deck asks Gmail's own search on `mail.google.com` for the unread mail of each inbox, to show which mail is starred and the mail past the 20 the feed lists. When you type in the panel's search field, that query goes to the same search of each of your inboxes.
- **Gmail's action token.** To mark mail as read, archive, delete or report spam, Mail Deck reads the `GMAIL_AT` cookie that Gmail sets for `mail.google.com` and sends it back to `mail.google.com` with the action, the same way the Gmail web page does.
- **Gmail tab requests.** If "Check when Gmail tabs or the network change" is on in settings (it is by default), Mail Deck notices when a Gmail tab sends a request to `mail.google.com` so it can refresh the unread count. It does not read, block or change those requests.

## Where it goes

To `mail.google.com`, and to Google in two more cases:

- **Sender icons.** The panel shows a sender's site icon, loaded from Google's icon service (`www.google.com/s2/favicons`), which receives the sender's domain, such as `github.com`, never an address or a message.
- **Chrome sync.** If you turn on the settings copy in Chrome sync, your Mail Deck settings are stored with `chrome.storage.sync`, which Chrome keeps in your Google account like your other synced data. It is off by default.

Mail Deck does not send your mail, addresses, cookies or settings to its author or to any other party. It does not sell or share data, and it does not use your data for advertising or credit decisions.

## What it stores

Your settings, the order of your inboxes, the reminders you set and the current unread counts are kept in the browser's extension storage (`chrome.storage`) on your device. Reminders never reach Gmail. Removing the extension deletes all of it, except a settings copy you chose to keep in Chrome sync, which you can turn off in settings.

## Contact

Questions or problems: open an issue at https://github.com/EAbychkov/mail-deck/issues.
