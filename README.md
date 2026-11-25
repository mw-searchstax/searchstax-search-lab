# SearchStax Search Lab

A standalone preview for exploring SearchStax design and relevance settings using the fictional Central County University Health content.

Choose **Design a Search Page** to try a layout, share your design, or download starter code. Choose **Improve What People Find** to try the guided search and explore examples of synonyms, result order, and filtering. The live examples use Search Lab’s dedicated demo profiles. The public Central County website uses a separate search app.

## Run locally

Use Node.js 20.19 or later in the Node.js 20 series, or Node.js 22.12 or later. From this directory, install the locked dependencies and start Vite.

```sh
npm ci
npm run dev
```

For local QA, install the QA dependencies once with `npm --prefix qa/regression ci --ignore-scripts`. Leave Vite running and open Build in a fixture-backed browser with `SEARCH_LAB_BASE_URL=http://127.0.0.1:5173/ npm run qa:preview`. Use the port Vite printed if it differs.

The page loads the SearchStax JavaScript UI Kit from its CDN. Opening the Vite URL in an ordinary browser connects directly to the Search Endpoint configured in `index.html`. For release verification, use the budgeted command under **Test a clean build**.

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

Install Google Chrome and the locked QA dependencies. The QA browser supplies synthetic SearchLabDemo responses for Build and for each downloaded starter. The UI Kit and package installation may still use the network.

```sh
npm --prefix qa/regression ci --ignore-scripts
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Leave the preview running. In a second terminal at the repository root, point the tests at the freshly built site.

```sh
SEARCH_LAB_BASE_URL=http://127.0.0.1:4173/ npm test
```

For interactive QA, run `npm run qa:preview` with the preview server running. To try a served starter in the same fixture browser, set `QA_STARTER_URL` to its loopback URL. A regular browser opened directly on a served demo can still use its configured Search App.

Run `npm run qa:sorting` to exercise all three starting sorts in Build, download the twelve ZIPs, and run the JavaScript, React, Vue, and Angular starters locally. The runner prints the temporary artifact directory. Repeated fixture runs use zero sandbox searches.

Run `npm run qa:result-summary` to check count and range summaries in Build and all four starter downloads. It uses the local campus fixture to test paging, Load more, and the Location filter.

For an approved live release check, run `npm run qa:release -- --budget N sort-controls`, replacing `N` with the maximum number of live requests for that run. You can list additional checks after the budget. All listed checks share it. Requests reserve a slot before leaving the browser, including failed requests. A quota response stops further dispatch. The runner prints the total used. Release checks target the pilot unless you set `SEARCH_LAB_BASE_URL` or a supported `QA_STARTER_URL`.

The default suite checks both onboarding paths, mobile recovery, appearance, and downloads across four starter formats. The QA guide also covers WebKit and tests that run inside a downloaded starter, including JavaScript search recovery and slow React paging. [Regression guide](qa/regression/README.md)

### Preview an app’s published configuration

The [UI Kit coverage matrix](docs/ui-kit-coverage.md) lists the designer controls, framework bindings, and remaining demo and starter work.

The built-in Build preview searches SearchLabDemo’s English **SearchLabBuild** profile. Its default is set independently with `data-build-profile`. Search for **rehabilitation**, then open **Appearance → Hit highlighting** to style the returned passage. Improve uses its comparison profiles. It reads the profile catalog, entitlements, and published Related Searches, Smart Answers, and hit highlighting settings from the [SearchLabDemo snapshot](public/config/searchlabdemo.json), verified November 24, 2026. Refresh that file when the catalog, entitlements, or settings change. Build checks the snapshot against the search endpoint. On localhost, the QA summary shows feature entitlements and settings, including unknown values. An enabled service also needs its browser connection on the Search Lab element in `index.html` (`data-answer-endpoint`, or `data-related-endpoint` and the browser-safe `data-discovery-key`). On the hosted pilot, the built-in profile tabs use SearchLabDemo’s English Main Profile, SearchLabBuild, SearchLabAfter, and SearchLabRanking. On localhost, QA can choose **Features → Preview source → Fictional demo** to exercise the Programs and Locations examples.

In **Design a Search Page → Preview with your Search App**, enter the app’s Select endpoint, a browser-safe read-only token, and a test query. Open the optional connection settings to load an app-scoped JSON snapshot. Use the current Search Profiles list for each language, the app’s feature entitlements, and the published settings. Record Related Searches in `relatedSearchesByLanguage` and Smart Answers and highlighting on each profile. The [example snapshot](public/examples/search-lab-configuration.json) shows the Search Lab file format. Use `null` or omit a feature setting when you can’t verify it. Search Lab checks the snapshot against the connected app’s endpoint. An ordinary download carries the selected profile, language, and verified Related Searches and Smart Answers settings. The developer supplies the connected app’s endpoints and browser-safe credentials locally. The fictional source keeps its own sample terms and answer.

To try the published **Content type** facet on SearchLabBuild, search for **campus**, select **Location**, then clear the checkbox. The demo currently returns **37 → 8 → 37**. Under **Features → Filters and sorting**, choose how selected values match and how many values appear before **Show more** on desktop and mobile. The defaults are **Any selected value (OR)** and **20** on each screen size. Result ribbons display each word with an initial capital. Search requests use the original indexed value.

To try promotions, search for **campus flu clinic** on SearchLabBuild. The 2026 notice appears first with a badge, and a banner links to flu shot appointment information. Open **Appearance → Promotion appearance** to change the badge and banner. Under **Features → Advanced Options**, choose whether the banner appears above or below the results. Search for **rehabilitation** to see the same layout without either promotion. A connected app uses its own published triggers. The localhost fictional demo has separate sample promotions.

To repeat the promotion download checks, run `qa/regression/promotions.cjs` with `SEARCH_LAB_BASE_URL` set to local Build and `QA_ARTIFACT_DIR` set to a temporary directory. It saves the four app downloads under `promotions/single` and the four fictional downloads under `promotions/fictionalSingle`. Serve each extracted starter using its README, then run the same check with `QA_STARTER_URL` set to that starter’s local URL. Set `QA_FICTIONAL_STARTER=1` for the fictional downloads.

With a snapshot loaded, enable **Features → Advanced Options → Show profile tabs** and select the profiles to include. Each tab submits the selected language and profile as `language` and `model`. Without a snapshot, you can preview the default profile or name one in the connection form. The runtime Search API documents profile selection and per-query metadata. It doesn’t document catalog discovery or entitlement lookup. [Search API](https://support.searchstax.com/hc/en-us/articles/40243554096141-Search-API) · [Search Profiles](https://support.searchstax.com/hc/en-us/articles/40151687838989-Search-Profiles)

The preview reads card roles and field order from each response’s `metadata.results`. The UI Kit matches each entry’s `name` to the document field and `result_card` to a role such as title, URL, ribbon, or thumbnail. It exposes additional return fields as `unmappedFields` and looks up highlight fragments by `responseHeader.params.uniqueId` and field name. The Lab preserves readable fields on unlinked cards and treats highlight text as text with emphasis. Search Fields control matching. They don’t supply card mappings. [Results Fields](https://support.searchstax.com/hc/en-us/articles/40837318253197-Results-Fields) · [UI Kits FAQ](https://support.searchstax.com/hc/en-us/articles/40395962883085-UI-Kits-FAQ)

Facets, configured sorting, suggestions, Related Searches, answers, promotions, and pagination have standard UI Kit widgets. A fixed page size is a Results widget option. The Lab’s page-size selector, profile and language navigation, custom labels, logo, and alternate facet layout need template, layout, or request code. Ordinary appearance settings use CSS. Related Searches needs its endpoint and Discovery key. Smart Answers needs its Answer endpoint. The Lab checks the app entitlement and the published setting for the selected language (Related Searches) or profile (Smart Answers). Related Searches sends the search phrase and language to Discovery. Its placement control is under Advanced Options. [Widget configuration](https://support.searchstax.com/hc/en-us/articles/40396499930381-Common-Widget-Configuration) · [Customize UI Kit labels](https://support.searchstax.com/hc/en-us/articles/39887289163021-Customize-UI-Kit-Labels)

In Build, open **Features → Pagination** and choose **Load more** to append results. You can edit the button text there. Search **campus** on SearchLabBuild with the default batch size of 10 to try it. The preview and downloaded starters keep earlier results visible until you change the search or filter.

Under **Appearance → Search feedback**, choose **Result count** or **Visible range**, then place the summary above or below the results. The default is the count above the results. With ten results per page, the second page of **campus** shows **11–20 of 37**. Using **Load more** once shows **1–20 of 37**.

To try sorting, search **campus** on SearchLabBuild. In **Features → Filters and sorting**, set **Starting sort** to **Relevance**, **Page address (A–Z)**, or **Page address (Z–A)**. Relevance uses the profile’s default order. Each profile supplies its own sort choices. Set the dropdown’s label in **Appearance → Sorting** and its position in **Features → Advanced Options**. The design and starter downloads remember these settings. Visitors can still choose another sort.
