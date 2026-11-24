# SearchStax JavaScript Starter

This starter uses the SearchStax JavaScript UI Kit to search the fictional Central County university health website. It comes connected to the public, read-only demo, so you can try it without a SearchStax account.

## Run the Demo

1. Extract the ZIP file.
2. With Python 3 installed, open a terminal in the extracted folder that contains `index.html` and run this command.

   ```sh
   python3 -m http.server 4175 --bind 127.0.0.1
   ```

3. Open [http://127.0.0.1:4175/](http://127.0.0.1:4175/) in your browser. You'll need an internet connection to load the UI Kit and search the demo.

Press Ctrl+C in the terminal when you're done.

## Try your design

For the default demo, search for **rehabilitation**. If related searches are visible, choose **physical therapy**. The search box and results update to the selected term.

If you enabled sample thumbnails, the ZIP includes fictional images for two Central County results.

Sorting is on by default and starts in Relevance order. When sorting is enabled, use **Sort by** to put all matching pages in page-address order, even when the results span several pages.

If search can’t start, choose **Reload search**. If a search fails or takes longer than usual, choose **Retry search** to repeat it with the same query, sort, filters and page. When earlier results are still on screen, the status message tells you.

If you enabled sample search suggestions, type `reh` to try them. Choosing a suggestion runs a search against the fictional demo.

If your design shows the Smart Answers sample, expand **Smart Answers Sample** to see the fixed fictional answer and its source link.

If you enabled sample promotions, the starter opens with `campus flu clinic`. The indexed sample moves the 2026 notice to the first relevance result when that notice is present. The external sample displays a separate link above the results. [Indexed and external promotions](https://support.searchstax.com/hc/en-us/articles/40499202855693-Promotions-Indexed-vs-External)

The starter uses the **Results per page** setting from your design. To change it in the starter, edit `resultsPerPage` in `search.js`.

To change the message visitors see when a search finds no matches, edit `noResultsText` in `search.js`.

## Connect Your Search App

1. In Site Search, open an existing Search App with indexed content. Go to **App Settings > All APIs > Search & Indexing** to find the Select endpoint (ending in `/emselect`) and a **Read Only** token.
2. Open `search.js` and find **UI Kit connection settings**. Set `searchURL` to your Select endpoint, `searchAuth` to the Read Only token, and `model` to your Search Profile name. Set `language` to the language configured for the App, such as `fr_ca` for Canadian French. Result titles and descriptions use that language while the starter controls stay in English. If you enabled filters in Search Lab, the starter displays the facets configured for that profile.
3. In your Search Profile, go to **Configurations > Basic Configurations > Results Fields**. Map the fields you want to show to **Title**, **URL**, and **Description**. Use full `https://` or `http://` URLs in the field you map to **URL**. If you're showing filters, configure the indexed fields visitors can filter by under **Faceting**. Publish your changes in Site Search. [Results Fields](https://support.searchstax.com/hc/en-us/articles/40837318253197-Results-Fields) · [Faceting](https://support.searchstax.com/hc/en-us/articles/40836775695117-Faceting)
4. In `index.html`, update the page title, heading, and search field text for your site. Change the sample query in the search input's `value` attribute to a term that matches your content, then reload the page to try it.

Publish indexed or external promotions in the connected Search Profile and search for one of their trigger phrases. External promotions appear above the results. Indexed promotions display a **Promoted** label in the order returned by the app. The sample promotions are available with the included Central County connection. [Promotions](https://support.searchstax.com/hc/en-us/articles/40155433600397-Promotions)

For Related Searches on your own app, set `relatedURL` and `discoveryKey` in `search.js`. Use the endpoint and key from **App Settings → All APIs → Discovery**. The fictional demo includes related terms for `rehabilitation`. [Related Searches API](https://support.searchstax.com/hc/en-us/articles/40243333638541-Related-Searches-API)

Result links work with tracking off, the default. To enable search and result-click tracking on your own app, open **App Settings > All APIs > Analytics**. In `search.js`, set `analyticsBaseUrl` to the origin of your Tracking URL (the `https://` address before `/api/v2/track/`) and `trackApiKey` to the Tracking key. Leave both blank to keep tracking off. If your site requires consent, supply these settings only after the visitor opts in.

Always use a Read Only credential for search requests in browser code. For a private setup where the endpoint or token must stay on your server, use a server-side proxy. [Hide Tokens and Endpoints in UI Kits](https://support.searchstax.com/hc/en-us/articles/39440547272077-Hide-Tokens-and-Endpoints-in-UI-Kits)

If you move the search UI into an existing page, keep the `.search-starter` wrapper so the styles in `search.css` still apply. The standalone page uses `.search-starter-page` on the body for the page margin and colors.

For sorting on your app, configure and publish sort options on your Search Profile under **Configurations > Advanced Configurations > Sorting**. Set `showSorting` to `true` in `search.js`. **Sort by** displays the published options after a search. Choosing an option keeps the current filters and returns to the first page. [Facets and sorting setup](https://support.searchstax.com/hc/en-us/articles/38268731934349-Setting-Up-Facets-Filters-and-Sorting)

For live suggestions on your app, enable and publish Auto-Suggest in Site Search. In `search.js`, set `suggesterURL` to the app’s HTTPS Auto-Suggest endpoint ending in `/emsuggest`, and set `showSuggestions` to `true`. The starter uses the same read-only token and language as search. Use the arrow keys and Enter to search for a suggestion, or press Escape to dismiss the list. Leave `suggesterURL` empty to use search without connected suggestions. [Auto-Suggest](https://support.searchstax.com/hc/en-us/articles/40075200119437-Auto-Suggest) · [Auto-Suggest API](https://support.searchstax.com/hc/en-us/articles/40243330090893-Auto-Suggest-API)

The Smart Answers sample is available with the Central County connection. For live answers on your own app, enable and publish Smart Answers on the Search Profile you set in `model`. In `search.js`, set `questionURL` to that app’s HTTPS streaming Smart Answers endpoint and set `showSmartAnswersSample` to `true` to display the answer. The starter uses the same read-only token and language as search. It requests an answer for the opening query and each submitted search. Leave `questionURL` empty to skip answer requests. [Smart Answers setup](https://support.searchstax.com/hc/en-us/articles/40075209934989-Smart-Answers) · [Smart Answers API](https://support.searchstax.com/hc/en-us/articles/40243570123021-Smart-Answers-API)
