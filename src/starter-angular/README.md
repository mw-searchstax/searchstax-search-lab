# SearchStax Angular Starter

This starter uses the SearchStax Angular UI Kit and your Search Lab design. A SearchLabDemo download is ready to search. For a connected-app download, add your endpoint and read-only token under **Connect Your Search App** before you run it.

## Run the Demo

Use Node.js 22.22.3+ on the 22.x line, Node.js 24.15+ on the 24.x line, or Node.js 26 or later.

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Angular CLI. The demo search requires an internet connection. Run `npm run build` to generate the browser files in `dist/starter/browser/`.

- Search for `rehabilitation` to try filters or view the optional sample thumbnails.
- Search for `campus flu clinic` to try paging, sorting, or the Promotion formats selected in your design.
- On SearchLabDemo, type `reh` to try suggestions if you enabled them in your design.

## Connect Your Search App

Use `src/config.js` to connect your app. Keep the `demo` object and set `connection.searchURL` to your Select endpoint, `connection.searchAuth` to an active **Read Only** token, `connection.model` to your Search Profile name, and `connection.language` to the language configured for your app. Set `connection.initialQuery` to a term that matches your content or leave it empty to start with a blank search box.

1. Find the Select endpoint and token under **App Settings > All APIs > Search & Indexing**.
2. Map Title, URL, and Description under the profile’s **Results Fields**. Map Thumbnail if you display images. Configure and publish any facets, sort options, and Promotions you want to use. [Results Fields](https://support.searchstax.com/hc/en-us/articles/40837318253197-Results-Fields)
3. For live suggestions, publish Auto-Suggest, set `suggesterURL` to its endpoint, and enable `showSuggestions` in `design`. [Auto-Suggest API](https://support.searchstax.com/hc/en-us/articles/40243330090893-Auto-Suggest-API)

### Related Searches and Smart Answers

The download includes the selected app’s feature settings in `src/feature-settings.js`. Related Searches uses the app entitlement and the published setting for the search language. Smart Answers uses its entitlement and the published setting for the selected profile and language. An off or unknown setting leaves that feature out.

In `src/config.js`, enter `relatedURL` and the browser-safe `discoveryKey` from **App Settings → All APIs → Discovery** to receive related terms. For Smart Answers, enter the streaming `questionURL` or a same-origin streaming proxy. Answers use the search token, language, and profile. [Related Searches API](https://support.searchstax.com/hc/en-us/articles/40243333638541-Related-Searches-API) · [Smart Answers setup](https://support.searchstax.com/hc/en-us/articles/40075209934989-Smart-Answers)

If you switch apps or the published settings change, reconnect in Build with the updated app configuration and download a fresh starter. For fixed examples of both features, choose **Fictional demo** in local Search Lab before downloading.

Result links open with tracking off by default. To enable search and result-click tracking on your own app, open **App Settings > All APIs > Analytics**. In `src/config.js`, set `connection.analyticsBaseUrl` to the origin of your Tracking URL (the `https://` address before `/api/v2/track/`) and `connection.trackApiKey` to the Tracking key. Leave both blank to keep tracking off. If your site requires consent, supply these settings only after the visitor opts in.

### Thumbnail Descriptions

To show informative thumbnails, enable thumbnails in the design and map the image URL field to **Thumbnail**. Add the indexed description as a Return Field with **No mapping** in **Results Fields**. Then set `connection.thumbnailAltField` in `src/config.js` to that field’s name, such as `image_alt`. Use a description that conveys the information the image adds. The starter omits a connected thumbnail when its description is missing. Set `thumbnailsWithoutAltAreDecorative` to `true` only if every thumbnail without a description is decorative or repeats the nearby text. Those images use empty alt text. [Decorative images](https://www.w3.org/WAI/tutorials/images/decorative/)

Browser code is visible to visitors. Use a server-side proxy for tokens that need to stay private. [Endpoint and token guidance](https://support.searchstax.com/hc/en-us/articles/39440547272077-Hide-Tokens-and-Endpoints-in-UI-Kits)

Use `src/search-app.html` to change the Angular widget templates and `search.css` to change their appearance. Retain the `.search-starter` wrapper so the exported selectors apply. [Angular UI Kit setup](https://support.searchstax.com/hc/en-us/articles/40364056121997-Getting-Started-With-searchstudio-ux-angular)
