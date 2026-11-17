# SearchStax Search Lab

A standalone preview for exploring SearchStax design and relevance settings using the fictional Alder Coast University Health content.

The preview includes the Search Fields and Ranking scenarios, layout and styling controls, shareable settings, and starter CSS. Searches use the existing isolated demo Search App and its prepared Search Profiles.

## Run locally

From this directory, start a static server:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/`. Searches connect automatically to the isolated demo app using the Search Endpoint, read-only Search API credential, and prepared profile names configured in `index.html`.

The page loads the SearchStax JavaScript UI Kit from its CDN and sends search requests directly to the configured SearchStax endpoint. Use the isolated demo app and public fictional content only. Don't use a read/write or administrative credential.

## Hosting

The preview is publicly hosted at https://mw-searchstax.github.io/searchstax-search-lab/. GitHub Pages deploys the root of the `main` branch.

The demo endpoint and read-only credential in `index.html` are public and visible to visitors. They must be limited to the isolated demo app and its fictional content. Don't use a read/write or administrative credential. Use a server-side proxy if a credential must remain private.

A staff-only Zendesk draft test saved the iframe markup but omitted both the Search Lab and an Alder Coast control iframe from the rendered article preview. No Zendesk Admin settings or theme templates were changed for this test.
