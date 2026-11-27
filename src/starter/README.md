# SearchStax JavaScript Starter

This starter uses the SearchStax JavaScript UI Kit and your Search Lab design. The built-in example uses eight recorded results for **rehabilitation**. You can open results, filter and sort them locally. For a connected-app download, add your endpoint and read-only token under **Connect Your Search App** before you run it.

## Run the Demo

1. Extract the ZIP file.
2. With Python 3 installed, open a terminal in the extracted folder that contains `index.html` and run this command.

   ```sh
   python3 -m http.server 4175 --bind 127.0.0.1
   ```

3. Open [http://127.0.0.1:4175/](http://127.0.0.1:4175/) in your browser. The starter loads the UI Kit from its CDN and reads the sample results locally.

Press Ctrl+C in the terminal when you're done.

## Try your design

Search for **rehabilitation**. The recorded results open with Simon Kelver when you use the default relevance order.

If you enabled sample thumbnails, the ZIP includes fictional images for two Central County results.

To try sorting, keep **rehabilitation** in the search box. The dropdown uses the label, position, and starting sort from your Build design. Choose **Relevance**, **Page address (A–Z)**, or **Page address (Z–A)** to reorder all matching pages.

If search can’t start, choose **Reload search**. If a search fails or takes longer than usual, choose **Retry search** to repeat it with the same query, sort, filters and page. When earlier results are still on screen, the status message tells you.

If you enabled sample search suggestions, type `reh` to try them. Choose **rehabilitation** for the recorded result set.

The starter uses the **Results per page** setting from your design. To change it in the starter, edit `resultsPerPage` in `search.js`.

To change the message visitors see when a search finds no matches, edit `noResultsText` in `search.js`.

## Connect Your Search App

1. In Site Search, open an existing Search App with indexed content. Go to **App Settings > All APIs > Search & Indexing** to find the Select endpoint (ending in `/emselect`) and a **Read Only** token.
2. Open `search.js` and find **UI Kit connection settings**. Set `searchURL` to your Select endpoint, `searchAuth` to the Read Only token, and `model` to your Search Profile name. Set `language` to the language configured for the App, such as `fr_ca` for Canadian French. Result titles and descriptions use that language while the starter controls stay in English. If you enabled filters in Search Lab, the starter displays the facets configured for that profile.
3. In your Search Profile, go to **Configurations > Basic Configurations > Results Fields**. Map the fields you want to show to **Title**, **URL**, and **Description**. Use full `https://` or `http://` URLs in the field you map to **URL**. If you're showing filters, configure the indexed fields visitors can filter by under **Faceting**. Publish your changes in Site Search. [Results Fields](https://support.searchstax.com/hc/en-us/articles/40837318253197-Results-Fields) · [Faceting](https://support.searchstax.com/hc/en-us/articles/40836775695117-Faceting)
4. In `index.html`, update the page title, heading, and search field text for your site. Change the sample query in the search input's `value` attribute to a term that matches your content, then reload the page to try it.

### Promotions

Search with a published trigger on the selected profile. An elevated result gets the indexed badge from your design. External items use the banner heading, style, and placement from your design. A normal query shows the profile’s ordinary results. To try the fixed samples, choose **Fictional demo** in local Search Lab. [Promotions setup](https://support.searchstax.com/hc/en-us/articles/40155433600397-Promotions)

### Related Searches and Smart Answers

The download includes the selected app’s feature settings in `feature-settings.js`. Related Searches uses the app entitlement and the published setting for the search language. Smart Answers uses its entitlement and the published setting for the selected profile and language. An off or unknown setting leaves that feature out.

In `search.js`, enter `relatedURL` and the browser-safe `discoveryKey` from **App Settings → All APIs → Discovery** to receive related terms. For Smart Answers, enter the streaming `questionURL` or a same-origin streaming proxy. Answers use the search token, language, and profile. [Related Searches API](https://support.searchstax.com/hc/en-us/articles/40243333638541-Related-Searches-API) · [Smart Answers setup](https://support.searchstax.com/hc/en-us/articles/40075209934989-Smart-Answers)

If you switch apps or the published settings change, reconnect in Build with the updated app configuration and download a fresh starter. For fixed examples of both features, choose **Fictional demo** in local Search Lab before downloading.

Result links work with tracking off, the default. To enable search and result-click tracking on your own app, open **App Settings > All APIs > Analytics**. In `search.js`, set `analyticsBaseUrl` to the origin of your Tracking URL (the `https://` address before `/api/v2/track/`) and `trackApiKey` to the Tracking key. Leave both blank to keep tracking off. If your site requires consent, supply these settings only after the visitor opts in.

Always use a Read Only credential for search requests in browser code. For a private setup where the endpoint or token must stay on your server, use a server-side proxy. [Hide Tokens and Endpoints in UI Kits](https://support.searchstax.com/hc/en-us/articles/39440547272077-Hide-Tokens-and-Endpoints-in-UI-Kits)

If you move the search UI into an existing page, keep the `.search-starter` wrapper so the styles in `search.css` still apply. The standalone page uses `.search-starter-page` on the body for the page margin and colors.

For sorting on your app, configure and publish sort options on your Search Profile under **Configurations > Advanced Configurations > Sorting**. With `showSorting` enabled in `search.js`, the dropdown displays the options returned by that profile. If your chosen starting sort is unavailable, the starter uses relevance. Choosing another sort keeps the current filters and returns to the first page. [Facets and sorting setup](https://support.searchstax.com/hc/en-us/articles/38268731934349-Setting-Up-Facets-Filters-and-Sorting)

For live suggestions on your app, enable and publish Auto-Suggest in Site Search. In `search.js`, set `suggesterURL` to the app’s HTTPS Auto-Suggest endpoint ending in `/emsuggest`, and set `showSuggestions` to `true`. The starter uses the same read-only token and language as search. Use the arrow keys and Enter to search for a suggestion, or press Escape to dismiss the list. Leave `suggesterURL` empty to use search without connected suggestions. [Auto-Suggest](https://support.searchstax.com/hc/en-us/articles/40075200119437-Auto-Suggest) · [Auto-Suggest API](https://support.searchstax.com/hc/en-us/articles/40243330090893-Auto-Suggest-API)

## Thumbnail descriptions

Result cards display a mapped **Thumbnail** beside or above the result text. The starter treats these images as decorative by default and uses empty alt text. If an image adds information, return its description as an additional field in **Results Fields**. In `search.js`, set `config.thumbnailAltField` to that field’s name and `config.thumbnailsWithoutAltAreDecorative` to `false`. The starter then omits images that lack a description.
