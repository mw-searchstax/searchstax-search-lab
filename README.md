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

### Preview an app’s published configuration

The built-in Build preview searches SearchLabDemo’s English Main Profile. It reads Related Searches and Smart Answers settings from the [SearchLabDemo snapshot](public/config/searchlabdemo.json), verified November 24, 2026. Refresh that file after publishing changes to either feature. Build checks the snapshot against the search endpoint and shows unknown settings when it can’t verify them. An enabled service also needs its browser connection on the Search Lab element in `index.html` (`data-answer-endpoint`, or `data-related-endpoint` and the browser-safe `data-discovery-key`). The fictional Programs and Locations profiles use local examples.

In **Design a Search Page → Preview with your Search App**, enter the app’s Select endpoint, a browser-safe read-only token, and a test query. Open the optional connection settings to load an app-scoped JSON snapshot. Use the current Search Profiles list for each language, the app’s feature entitlements, and the published settings for each profile. The [example snapshot](public/examples/search-lab-configuration.json) shows the Search Lab file format. Use `null` or omit a feature setting when you can’t verify it. The snapshot stays in the browser. Search Lab checks its endpoint against the connected app.

With a snapshot loaded, enable **Features → Advanced Options → Show profile tabs** and select the profiles to include. Each tab submits the selected language and profile as `language` and `model`. Without a snapshot, you can preview the default profile or name one in the connection form. The runtime Search API documents profile selection and per-query metadata. It doesn’t document catalog discovery or entitlement lookup. [Search API](https://support.searchstax.com/hc/en-us/articles/40243554096141-Search-API) · [Search Profiles](https://support.searchstax.com/hc/en-us/articles/40151687838989-Search-Profiles)

The preview reads card roles and field order from each response’s `metadata.results`. The UI Kit matches each entry’s `name` to the document field and `result_card` to a role such as title, URL, ribbon, or thumbnail. It exposes additional return fields as `unmappedFields` and looks up highlight fragments by `responseHeader.params.uniqueId` and field name. The Lab preserves readable fields on unlinked cards and treats highlight text as text with emphasis. Search Fields control matching. They don’t supply card mappings. [Results Fields](https://support.searchstax.com/hc/en-us/articles/40837318253197-Results-Fields) · [UI Kits FAQ](https://support.searchstax.com/hc/en-us/articles/40395962883085-UI-Kits-FAQ)

Facets, configured sorting, suggestions, Related Searches, answers, promotions, and pagination have standard UI Kit widgets. A fixed page size is a Results widget option. The Lab’s page-size selector, profile and language navigation, custom labels, logo, and alternate facet layout need template, layout, or request code. Ordinary appearance settings use CSS. Related Searches needs its endpoint and Discovery key. Smart Answers needs its Answer endpoint. Both require a confirmed entitlement and an enabled setting for the selected profile. An endpoint alone supplies neither. [Widget configuration](https://support.searchstax.com/hc/en-us/articles/40396499930381-Common-Widget-Configuration) · [Customize UI Kit labels](https://support.searchstax.com/hc/en-us/articles/39887289163021-Customize-UI-Kit-Labels)
