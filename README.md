# SearchStax Search Lab

A standalone preview for exploring SearchStax design and relevance settings using the fictional Alder Coast University Health content.

The preview includes the Search Fields and Ranking scenarios, layout and styling controls, shareable settings, and starter CSS. Searches use the existing isolated demo Search App and its prepared Search Profiles.

## Run locally

From this directory, start a static server:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/`. To run searches, use the preview connection form with the demo app's Select Endpoint, an active **read-only** Search API credential, and the three prepared profile names. Connection details stay in the current browser tab's session storage and aren't included in share links.

The page loads the SearchStax JavaScript UI Kit from its CDN and sends search requests directly to the configured SearchStax endpoint. Use the isolated demo app and public fictional content only. Don't use a read/write or administrative credential.

## Hosting

The preview is publicly hosted at https://mw-searchstax.github.io/searchstax-search-lab/. GitHub Pages deploys the root of the `main` branch. Each browser session currently needs the demo connection details entered in the preview form, so this is not yet a self-service visitor experience.

A read-only credential supplied to browser code is visible to visitors; use a server-side proxy if it must remain private. A visitor-facing deployment still needs an agreed connection approach and a review of the host's terms.

A staff-only Zendesk draft test saved the iframe markup but omitted both the Search Lab and an Alder Coast control iframe from the rendered article preview. No Zendesk Admin settings or theme templates were changed for this test.
