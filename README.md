# SearchStax Search Lab

A standalone preview for exploring SearchStax design and relevance settings using the fictional Central County University Health content.

Choose **Design a Search Page** to try a layout, share your design, or download starter code. Choose **Improve What People Find** to try the guided search and explore examples of synonyms, result order, and filtering. The opening search and guided lessons use recorded responses from SearchLabPilot. A visitor can also submit a search to the production app in the hosted pilot. The public Central County website uses a separate search app.

## Run locally

Use Node.js 20.19 or later in the Node.js 20 series, or Node.js 22.12 or later. From this directory, install the locked dependencies and start Vite.

```sh
npm ci
npm run dev
```

For local QA, install the QA dependencies once with `npm --prefix qa/regression ci --ignore-scripts`. Leave Vite running and open Build in a fixture-backed browser with `SEARCH_LAB_BASE_URL=http://127.0.0.1:5173/ npm run qa:preview`. Use the port Vite printed if it differs.

The page loads the SearchStax JavaScript UI Kit from its CDN. Opening the Lab locally uses the recorded examples. To exercise free-text searches in local QA, use the fixture-backed browser above.

## Reproduce the published pilot

Develop and review changes on `main`. GitHub Pages serves the built files from the root of `gh-pages`. The Help Center embeds that deployment. Use the verification command below to compare a checkout with the current release. [Open Search Lab](https://mw-searchstax.github.io/searchstax-search-lab/)

From a fresh clone, use the Node version in `.nvmrc` (26.8.2, verified with npm 11.19.1). Run these commands in the repository root.

```sh
npm ci
# For an exact hosted build, set SEARCH_LAB_PILOT_READ_TOKEN in the build environment.
npm run build
git fetch origin refs/heads/gh-pages:refs/remotes/origin/gh-pages
npm run verify:pages
```

The build type-checks TypeScript and writes the static site to `dist/`. With no token, this produces the recorded-only fallback. For the hosted build, supply the SearchLabPilot browser-safe **Read Only** Search API token as `SEARCH_LAB_PILOT_READ_TOKEN`. Vite inserts it in the public HTML at build time. Verification compares every emitted file byte for byte with the fetched Pages commit and the public site, then prints its SHA-256 digest. It expects this checkout to correspond to the current deployment. Older assets retained on the hosting branch belong to earlier releases.

## November pilot recovery

SearchLabDemo showed 10.14K searches against its 10K sandbox allowance. Before fixture-first QA, opening Build, running the browser suites and trying a downloaded starter could all query that same app. A fixture replay put a full regression run at roughly 90 query-bearing requests, and at least 33 earlier logs contained the suite command. Some logs may cover the same run. Those figures show how repeated QA could spend thousands of searches. The monthly total alone doesn’t identify the source of each request.

SearchLabPilot uses a dedicated unscheduled crawler for the public Central County content. Its initial crawl indexed 103 documents. The nine recorded responses in `src/recorded-searches.json` come from that production index. They retain result order, field mappings, public links and returned highlight fragments. Re-run the recording checks after an intentional refresh. The sandbox Audience recrawl and live sort check are on hold until its quota resets.

If the production connection fails after a release, restore the recorded-only Pages entry point from the deployment history. Its hashed assets remain on the hosting branch. You can also rebuild the same source without `SEARCH_LAB_PILOT_READ_TOKEN`. Verify the opening example and lessons on the fallback before resuming the live pilot.

## Test a clean build

Install Google Chrome and the locked QA dependencies. The QA browser supplies local fixture responses for Build and for each downloaded starter. The UI Kit and package installation may still use the network.

```sh
npm --prefix qa/regression ci --ignore-scripts
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Leave the preview running. In a second terminal at the repository root, point the tests at the freshly built site.

```sh
SEARCH_LAB_BASE_URL=http://127.0.0.1:4173/ npm test
```

For interactive QA, run `npm run qa:preview` with the preview server running. To try a served starter in the same fixture browser, set `QA_STARTER_URL` to its loopback URL. Downloaded examples run against bundled sample content. To test an integration, supply the developer’s own Search App connection.

Run `npm run qa:sorting` to exercise all three starting sorts in Build, download the twelve ZIPs, and run the JavaScript, React, Vue, and Angular starters locally. The runner prints the temporary artifact directory. In each unpacked test copy it configures a fixture-only connection so the 37-result campus dataset can exercise paging and sorting. The exported ZIP keeps its local sample.

With the local preview running, use `npm run qa:result-cards` to exercise the card editor and all eight ordinary and profile-tab downloads. The runner supplies fixture search responses and images. It checks missing and invalid fields, a failed image, shared designs and desktop and phone layouts. Set `SEARCH_LAB_BASE_URL` to the loopback preview URL if it differs from the default.

Run `npm run qa:result-summary` to check count and range summaries in Build and all four starter downloads. It uses the local campus fixture to test paging, Load more, and the Location filter.

For live verification, use a stable release ID for every capture and retry. The release runner reserves one slot before each outbound request. It enforces a ceiling of 10 per release and 100 per calendar month for internal QA on the designated Mac. A quota response stops the run. The ledger is shared across checkouts at `~/Library/Application Support/Search Lab/qa-live-budget.json`. Run the ordinary regression suite against fixtures. Reserve production searches for cases that require the published app.

The one-query release check opens the recorded Build example, submits **campus flu clinic**, checks the elevated 2026 notice and the external appointment link, and repeats the query to verify reuse. For this rollout the command is `QA_RELEASE_ID=pilot-recovery-2026-11 npm run qa:release -- --budget 1 pilot-smoke`. The nine recordings and this check use the full release budget.

For the first week after cutover, compare the **SearchLabPilot** app row in **Subscriptions → Production Apps** on consecutive daily refreshes. Record the meter timestamp, search total and change. Investigate an increase above 500 searches in one day against that day's release ledger and pilot activity. The 1M production allowance is shared with other production apps. The 100-request QA ceiling covers internal test traffic on the designated Mac. Visitor searches appear in the service meter.

The default suite checks both onboarding paths, mobile recovery, appearance, and downloads across four starter formats. The QA guide also covers WebKit and tests that run inside a downloaded starter, including JavaScript search recovery and slow React paging. [Regression guide](qa/regression/README.md)

### Preview an app’s published configuration

The [UI Kit coverage matrix](docs/ui-kit-coverage.md) lists the designer controls, framework bindings, and remaining demo and starter work.

The built-in Build preview searches SearchLabPilot’s English **SearchLabBuild** profile. Its default is set independently with `data-build-profile`. Search for **rehabilitation**, then open **Appearance → Hit highlighting** to style the returned passage. Improve uses its comparison profiles. It reads the profile catalog, entitlements, and published Related Searches, Smart Answers, and hit highlighting settings from the [SearchLabPilot snapshot](public/config/searchlabpilot.json). Refresh that file when the catalog, entitlements, or settings change. Build checks the snapshot against the search endpoint. On localhost, the QA summary shows feature entitlements and settings, including unknown values. An enabled service also needs its browser connection on the Search Lab element in `index.html` (`data-answer-endpoint`, or `data-related-endpoint` and the browser-safe `data-discovery-key`). On the hosted pilot, the built-in profile tabs use SearchLabPilot’s English Main Profile, SearchLabBuild, SearchLabAfter, and SearchLabRanking. On localhost, QA can choose **Features → Preview source → Fictional demo** to exercise the Programs and Locations examples.

In **Design a Search Page → Preview with your Search App**, enter the app’s Select endpoint, a browser-safe read-only token, and a test query. Open the optional connection settings to load an app-scoped JSON snapshot. Use the current Search Profiles list for each language, the app’s feature entitlements, and the published settings. Record Related Searches in `relatedSearchesByLanguage` and Smart Answers and highlighting on each profile. The [example snapshot](public/examples/search-lab-configuration.json) shows the Search Lab file format. Use `null` or omit a feature setting when you can’t verify it. Search Lab checks the snapshot against the connected app’s endpoint. An ordinary download carries the selected profile, language, and verified Related Searches and Smart Answers settings. The developer supplies the connected app’s endpoints and browser-safe credentials locally. The fictional source keeps its own sample terms and answer.

To try the published **Content type** facet on SearchLabBuild, search for **campus**, select **Location**, then clear the checkbox. The campus QA fixture returns **37 → 8 → 37**. Under **Features → Filters and sorting**, choose how selected values match and how many values appear before **Show more** on desktop and mobile. The defaults are **Any selected value (OR)** and **20** on each screen size. Result ribbons display each word with an initial capital. Search requests use the original indexed value.

To try promotions, search for **campus flu clinic** on SearchLabBuild. The 2026 notice appears first with a badge, and a banner links to flu shot appointment information. Open **Appearance → Promotion appearance** to change the badge and banner. Under **Features → Advanced Options**, choose whether the banner appears above or below the results. Search for **rehabilitation** to see the same layout without either promotion. A connected app uses its own published triggers. The localhost fictional demo has separate sample promotions.

To repeat the promotion download checks, run `qa/regression/promotions.cjs` with `SEARCH_LAB_BASE_URL` set to local Build and `QA_ARTIFACT_DIR` set to a temporary directory. It saves the four app downloads under `promotions/single` and the four fictional downloads under `promotions/fictionalSingle`. Serve each extracted starter using its README, then run the same check with `QA_STARTER_URL` set to that starter’s local URL. Set `QA_FICTIONAL_STARTER=1` for the fictional downloads.

With a snapshot loaded, enable **Features → Advanced Options → Show profile tabs** and select the profiles to include. Each tab submits the selected language and profile as `language` and `model`. Without a snapshot, you can preview the default profile or name one in the connection form. The runtime Search API documents profile selection and per-query metadata. It doesn’t document catalog discovery or entitlement lookup. [Search API](https://support.searchstax.com/hc/en-us/articles/40243554096141-Search-API) · [Search Profiles](https://support.searchstax.com/hc/en-us/articles/40151687838989-Search-Profiles)

The preview reads card roles and field order from each response’s `metadata.results`. The UI Kit matches each entry’s `name` to the document field and `result_card` to a role such as title, URL, ribbon, or thumbnail. It exposes additional return fields as `unmappedFields` and looks up highlight fragments by `responseHeader.params.uniqueId` and field name. The Lab preserves readable fields on unlinked cards and treats highlight text as text with emphasis. Search Fields control matching. They don’t supply card mappings. [Results Fields](https://support.searchstax.com/hc/en-us/articles/40837318253197-Results-Fields) · [UI Kits FAQ](https://support.searchstax.com/hc/en-us/articles/40395962883085-UI-Kits-FAQ)

Facets, configured sorting, suggestions, Related Searches, answers, promotions, and pagination have standard UI Kit widgets. A fixed page size is a Results widget option. The Lab’s page-size selector, profile and language navigation, custom labels, logo, and alternate facet layout need template, layout, or request code. Ordinary appearance settings use CSS. Related Searches needs its endpoint and Discovery key. Smart Answers needs its Answer endpoint. The Lab checks the app entitlement and the published setting for the selected language (Related Searches) or profile (Smart Answers). Related Searches sends the search phrase and language to Discovery. Its placement control is under Advanced Options. [Widget configuration](https://support.searchstax.com/hc/en-us/articles/40396499930381-Common-Widget-Configuration) · [Customize UI Kit labels](https://support.searchstax.com/hc/en-us/articles/39887289163021-Customize-UI-Kit-Labels)

In Build, open **Features → Pagination** and choose **Load more** to append results. You can edit the button text there. Search **campus** on SearchLabBuild with the default batch size of 10 to try it. The preview keeps earlier results visible until you change the search or filter. In a recorded starter, choose **rehabilitation** and a page size of five to try Load more.

Under **Appearance → Search feedback**, choose **Result count** or **Visible range**, then place the summary above or below the results. The default is the count above the results. In the QA fixture with ten results per page, the second page of **campus** shows **11–20 of 37**. Using **Load more** once shows **1–20 of 37**.

To try sorting, search **campus** on SearchLabBuild. In **Features → Filters and sorting**, set **Starting sort** to **Relevance**, **Page address (A–Z)**, or **Page address (Z–A)**. Relevance uses the profile’s default order. Each profile supplies its own sort choices. Set the dropdown’s label in **Appearance → Sorting** and its position in **Features → Advanced Options**. The design and starter downloads remember these settings. Visitors can still choose another sort.
