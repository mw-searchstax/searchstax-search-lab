# SearchStax Search Lab

A standalone preview for exploring SearchStax design and relevance settings using the fictional Central County University Health content.

Choose **Design a Search Page** to try a layout, share your design, or download starter code. Choose **Improve What People Find** to try the guided search and explore examples of synonyms, result order, and filtering. The live examples use Search Lab’s dedicated demo profiles. The public Central County website uses a separate search app.

## Run locally

Use Node.js 20.19 or later in the Node.js 20 series, or Node.js 22.12 or later. From this directory, install the locked dependencies and start Vite.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Searches connect automatically to the isolated demo app using the Search Endpoint, read-only Search API credential, and prepared profile names configured in `index.html`.

The page loads the SearchStax JavaScript UI Kit from its CDN and sends search requests directly to the configured SearchStax endpoint. Use the isolated demo app and public fictional content only. Don't use a read/write or administrative credential.

## Reproduce the published pilot

Develop and review changes on `main`. GitHub Pages serves the built files from the root of `gh-pages`. The Help Center embeds that deployment. Use the verification command below to compare a checkout with the current release. [Open Search Lab](https://mw-searchstax.github.io/searchstax-search-lab/)

From a fresh clone, use the Node version in `.nvmrc` (26.8.2, verified with npm 11.19.1). Run these commands in the repository root.

```sh
npm ci
npm run build
git fetch origin refs/heads/gh-pages:refs/remotes/origin/gh-pages
npm run verify:pages
```

The build type-checks the TypeScript and writes the static site to `dist/`. Verification compares every emitted file byte for byte with the fetched Pages commit and the public site, then prints its SHA-256 digest. It expects this checkout to correspond to the current deployment. Older assets retained on the hosting branch belong to earlier releases.

## Test a clean build

Install Google Chrome and the locked QA dependencies. The ordinary demo and its UI Kit need network access. The connection tests use synthetic data and run with SearchStax Analytics off.

```sh
npm --prefix qa/regression ci --ignore-scripts
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Leave the preview running. In a second terminal at the repository root, point the tests at the freshly built site.

```sh
SEARCH_LAB_BASE_URL=http://127.0.0.1:4173/ npm test
```

The default suite checks both onboarding paths, mobile recovery, appearance, and downloads across four starter formats. The QA guide also covers WebKit and tests that run inside a downloaded starter, including JavaScript search recovery and slow React paging. [Regression guide](qa/regression/README.md)
