# SearchStax Search Lab

An unpublished standalone preview for exploring SearchStax design and relevance settings using the fictional Alder Coast University Health content.

The preview includes the Search Fields and Ranking scenarios, layout and styling controls, shareable settings, and starter CSS. Searches use the existing isolated demo Search App and its prepared Search Profiles.

## Run locally

From this directory, start a static server:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/`. To run searches, use the preview connection form with the demo app's Select Endpoint, an active **read-only** Search API credential, and the three prepared profile names. Connection details stay in the current browser tab's session storage and aren't included in share links.

The page loads the SearchStax JavaScript UI Kit from its CDN and sends search requests directly to the configured SearchStax endpoint. Use the isolated demo app and public fictional content only. Don't use a read/write or administrative credential.

## Hosting

This repository doesn't deploy or enable GitHub Pages. The page can be adapted for static hosting, but a visitor-facing deployment needs an agreed way to configure the demo connection, an appropriate company-owned host, and a review of the host's terms. A read-only credential supplied to browser code is visible to visitors; use a server-side proxy if it must remain private.

Embedding a separately hosted page in a Zendesk article also requires testing the Help Center's existing embed and content-security settings.
