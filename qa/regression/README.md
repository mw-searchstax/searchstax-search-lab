# Search Lab regression checks

Run these from this directory with the repository’s pinned Node.js version, npm, and Google Chrome. Start the local preview on port 4173 before running the suite. The QA browser uses synthetic search responses for Build and downloaded starters. The project README covers interactive fixture QA and opt-in, budgeted release checks. [QA commands](../../README.md#test-a-clean-build)

```sh
npm ci --ignore-scripts
npm test
```

| Check | What it verifies |
|---|---|
| `node entry.cjs` | Both meeting journeys, keyboard activation, filter count, Features/Appearance navigation, a clipboard-denied share link, and a fresh recipient restoring the design. |
| `node design.cjs` | Spanish profile, filter and draft preservation, a synthetic connected app on page two, optional endpoint/key pairing, credential exclusion from all four ZIPs, disconnect, and phone Edit/Preview. |
| `node sorting-defaults.cjs` | Fresh designs open on Relevance with the language picker off. Checks result order in both directions and on return to Relevance, reset and undo, saved opt-outs, legacy links, and all four starter downloads. Set `QA_SORT_EXPORT_DIR` to retain the downloads. Test a running download with `QA_STARTER_URL` and `QA_SORTING=on` or `off`. |
| `node editor-accessibility.cjs` | Both selected tabs and keyboard focus in light and dark forced colors in Chrome. Checks Appearance labels and controls at 286, 320, 390, 851, and 1440 CSS pixels with 200% text and increased spacing. Set `QA_BROWSER=webkit` for the WebKit layout checks. |
| `node profile-parity.cjs` | Both toggle orders, submitted and unsubmitted text, zero results, Spanish, live editor changes, phone filters, and the selected features and appearance in all three navigation modes. Compares the ordinary and profile sort controls using a custom font, rounded corners and a dark background. Checks the language selector, the desktop summary row and 320 px reflow. |
| `node profile-connection.cjs` | Connected profile and language requests against fixtures, sort, promotions, suggestions, related searches, streamed answers, return to single search, and private data exclusion in all four downloads. |
| `node improve.cjs` | Before, change, own-site guidance and undo for each main lesson, plus free search, recovery and secondary routes. |
| `node search-fields-recovery.cjs` | At phone width, checks a slow search, timeouts before and after a change, two HTTP 503s, keyboard retry, and switching lessons during an outage. Logs the HTTP status or browser failure, elapsed time, and visible lesson error. The entry and Improve checks also print these details if Search Fields fails. Use `QA_WIDTH` or `QA_BROWSER` to change the viewport or engine. |
| `node mobile-search-recovery.cjs` | Exercises field validation, rejected credentials, Search App timeouts, custom visitor searches, profile and language changes, sort, filters, pagination and comparison failures. Checks the visible error, Retry position and recovered request. Use `QA_BROWSER=webkit` for a 320-pixel viewport and `QA_HEIGHT=568` for a shorter screen. |
| `node ranking-recovery.cjs` | Runs the same recovery checks for Ranking. Verifies that the five results keep their order after a failed change and that retrying moves North Campus Clinic from fourth to first. The Improve check also records Ranking request and error details on failure. |
| `node starters.cjs` | Download and open all 16 ZIPs, inspect their configuration, and compare each stylesheet to its design’s CSS download. See [Running starter downloads](#running-starter-downloads) for the separate runtime checks. |

### Other browsers, widths and builds

```sh
npx playwright-core install webkit
QA_BROWSER=webkit QA_WIDTH=390 node entry.cjs
QA_BROWSER=webkit node design.cjs
QA_BROWSER=webkit node improve.cjs
SEARCH_LAB_BASE_URL=http://127.0.0.1:8080/ npm test
```

Serve the app at the supplied base URL. Use the application root with a trailing slash. The default QA browser serves a deterministic demo dataset. A count failure calls for checking the fixture or index against this release. The connected-app scenario in `design.cjs` intercepts its test endpoint locally.

`entry.cjs` and `improve.cjs` accept `QA_WIDTH` and `QA_BROWSER`. The design check uses both desktop and phone sizes in one run. The starter download check uses Chrome. To retain extracted artifacts in a chosen directory, supply an empty `QA_ARTIFACT_DIR` or let the script create its temporary directory.

### Running starter downloads

To check running downloads, set `QA_PROFILE_EXPORT_DIR` while running `node profile-parity.cjs`. It extracts three navigation configurations for each framework. Serve the JavaScript folder directly. For React, Vue and Angular, install using the bundled lockfile, build the app, and serve the output. Run the following against each served app, setting `QA_PROFILE_MODE` to `tabs`, `language`, or `both` as appropriate.

```sh
QA_STARTER_URL=http://127.0.0.1:8080/ QA_PROFILE_MODE=tabs node profile-parity.cjs
```

### Recovery in the JavaScript starter

Download the default JavaScript starter with sorting enabled, profile tabs and the language picker off, and tracking off. Serve the extracted folder over HTTP. From this regression directory, run the following, using the address of the starter.

```sh
QA_STARTER_URL=http://127.0.0.1:4175/ node javascript-starter-recovery.cjs
```

The phone-width Chrome check blocks the UI Kit, fails Select requests, and delays healthy responses past the 15-second slow-request message. It checks Reload and Retry, retained results, the recovered sort order, filtered pagination, and zero analytics attempts.

### Slow paging in the React starter

In Design, choose five results per page and leave profile tabs, the language picker, and analytics off. Download the React ZIP from **Get starter code**. In the extracted project run `npm ci`, then `npm run build`, and serve its `dist` directory. From this regression directory, run the following with the URL of the served starter.

```sh
QA_STARTER_URL=http://127.0.0.1:8080/ node react-starter-paging.cjs
```

The check searches *campus flu clinic*, filters to Providers, and holds the read-only page-two response for at least 1.5 seconds. It compares the range and ordered links before and after delivery against the actual responses. It then activates the second link by click and Enter in separate Chrome sessions, checks the destination URL, and reports any tracking request as a failure. The current demo has eight provider matches. A rerun needs at least seven. Run this check separately from `npm test`, which inspects the ZIP files.

### Signed-in Help Center and manual checks

Open the [Help Center pilot](https://support.searchstax.com/hc/en-us/articles/50554556822925-Search-Lab-Pilot) in a signed-in agent or admin session. In Design, search for *campus flu clinic* and filter to Providers. In Improve, run the Search Fields lesson for *travel vaccinations*, include Service name, and undo the change. Check the ordinary returning visit, article scroll position, return links, Share Design, and the phone’s Edit/Preview switch.

If an authorized browser storage-state file is already available locally, `entry.cjs` accepts the article URL in `QA_HELP_CENTER_URL` and the file path in `QA_STORAGE_STATE`. Keep private browser state outside this folder. The automated entry check forces clipboard denial to exercise the fallback. Use the ordinary article session to check whether that browser actually permits copy.

Skip VoiceOver and NVDA for this pilot. On Windows, move focus from the editor tab to a control and check that the selected tab remains visible in a contrast theme.
