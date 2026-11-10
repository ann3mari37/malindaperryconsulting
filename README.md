# MaLinda Perry Consulting

The public site, hosted on **Cloudflare Pages** (project `malindaperryconsulting`, ann3mari37@gmail.com's account).

| Address | What it is |
|---|---|
| `malindaperryconsulting.pages.dev` | This site (preview address) |
| `malindaperryconsulting.com` | This site, once the domain is attached to the Pages project |
| `admin.malindaperryconsulting.com` | **Not this project.** MaLinda's link library is the shared LinkHub Worker (`C:\amrycreations\linkhub`), locked to her family and shown in her theme |

## Folder layout

```
public/                 ← everything that gets published
  index.html            the one-page site
  css/site.css
  js/site-data.js       ★ books, events, booking link, email, socials
  js/site.js
  images/
  _headers
functions/
  _middleware.js        www → bare domain
  api/contact.js        contact form (POST /api/contact)
wrangler.toml
```

## Everyday edits (`public/js/site-data.js`)

- **Booking link:** set `scheduleUrl` (Calendly, Acuity, etc.). Until it's set, every "Book" button jumps to the contact form.
- **Books:** each book has a `buy` list. Today it's one BookFunnel link. When print launches through IngramSpark or Shopify, add a second entry, e.g. `{ label: "Buy the paperback", url: "https://…" }`. The first link is the orange button. A book with no links shows "Available soon."
- **Events:** `{ title, date: "YYYY-MM-DD", time, location, price, summary, details, registerUrl }`. Past events hide automatically. With no `registerUrl`, "Save my seat" opens the contact form with the event name filled in.
- **Covers:** put images in `public/images/books/` and set `cover`. Without one, a branded cover is drawn.

The coaching "Details" pop-ups and the bio live in `<template>` blocks at the bottom of `public/index.html`.

## Contact form

Set one or both in the Pages project settings:

- **KV binding** `CONTACT_KV` saves every message.
- **Secrets** `RESEND_API_KEY` + `CONTACT_TO` email each message (via resend.com).

If neither is set, the form tells visitors to email directly.

## Deploy

This project was created by direct upload, so deploys come from this folder rather than from GitHub:

```bash
CLOUDFLARE_ACCOUNT_ID=1ee0ccf466cef622b87273a6b7d79056 npx wrangler@3.112.0 pages deploy --branch main
```

## Local preview

```bash
npx wrangler@3.112.0 pages dev public --port 8788 --kv CONTACT_KV
```
