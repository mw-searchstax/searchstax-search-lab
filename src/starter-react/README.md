# SearchStax React Starter

This project uses the SearchStax React UI Kit and starts with the public Central County fictional demo. It includes your Search Lab design and uses Vite for local development.

## Run the Demo

Use Node.js 20.19+ on the 20.x line, or Node.js 22.12 or later.

```sh
npm ci
npm run dev
```

Open the localhost URL printed in the terminal. You’ll need an internet connection for the demo search. Run `npm run build` to create the deployable files in `dist/`.

- Search for `rehabilitation` to try filters or view the optional sample thumbnails.
- Search for `campus flu clinic` to try pagination, sorting, or the Promotion formats selected in your design.
- If you enabled sample suggestions, type `reh`. If the Smart Answers sample is visible, expand it to read the fixed answer and its source.

## Connect Your Search App

Use `src/config.js` to connect your app. Keep the `demo` object and set `connection.searchURL` to your Select endpoint, `connection.searchAuth` to an active **Read Only** token, `connection.model` to your Search Profile name, and `connection.language` to the language configured for your app. Set `connection.initialQuery` to a term that matches your content or leave it empty to start with a blank search box.

1. In Site Search, go to **App Settings > All APIs > Search & Indexing** for your Select endpoint and token.
2. Map Title, URL, and Description in your Search Profile’s **Results Fields**. Map Thumbnail if you’re displaying images. Configure and publish any facets, sort options, and Promotions you want to use. [Results Fields](https://support.searchstax.com/hc/en-us/articles/40837318253197-Results-Fields)
3. For live suggestions, enable and publish Auto-Suggest and set `suggesterURL` to its endpoint. For live Smart Answers, enable and publish the feature on your eligible profile and set `questionURL` to the streaming Answer endpoint. Enable the corresponding display options in the exported `design` object. [Auto-Suggest API](https://support.searchstax.com/hc/en-us/articles/40243330090893-Auto-Suggest-API) · [Smart Answers setup](https://support.searchstax.com/hc/en-us/articles/40075209934989-Smart-Answers)

For Related Searches on your own app, set `relatedURL` and `discoveryKey` in the `connection` object in `src/config.js`. Use the endpoint and key from **App Settings → All APIs → Discovery**. The fictional demo includes related terms for `rehabilitation`. [Related Searches API](https://support.searchstax.com/hc/en-us/articles/40243333638541-Related-Searches-API)

Result links open with tracking off by default. To enable search and result-click tracking on your own app, open **App Settings > All APIs > Analytics**. In `src/config.js`, set `connection.analyticsBaseUrl` to the origin of your Tracking URL (the `https://` address before `/api/v2/track/`) and `connection.trackApiKey` to the Tracking key. Leave both blank to keep tracking off. If your site requires consent, supply these settings only after the visitor opts in.

The starter requests a Smart Answer for the opening query and submitted searches. Use the SearchStax streaming endpoint or a same-origin proxy that returns the same event stream.

### Thumbnail Descriptions

To show informative thumbnails, enable thumbnails in the design and map the image URL field to **Thumbnail**. Add the indexed description as a Return Field with **No mapping** in **Results Fields**. Then set `connection.thumbnailAltField` in `src/config.js` to that field’s name, such as `image_alt`. Use a description that conveys the information the image adds. The starter omits a connected thumbnail when its description is missing. Set `thumbnailsWithoutAltAreDecorative` to `true` only if every thumbnail without a description is decorative or repeats the nearby text. Those images use empty alt text. [Decorative images](https://www.w3.org/WAI/tutorials/images/decorative/)

Browser code is visible to visitors. Use a server-side proxy when a token must stay private. [Endpoint and token guidance](https://support.searchstax.com/hc/en-us/articles/39440547272077-Hide-Tokens-and-Endpoints-in-UI-Kits)

Edit `search.css` for styling. Retain the `.search-starter` wrapper so the exported selectors still apply.

## Use It in Next.js

In an existing Next.js App Router project, install the React UI Kit version pinned in this ZIP. Copy the files from `src/` except `main.jsx` into your search route. Copy `public/thumbnails/` if it’s present. Import `search.css` from your route or root layout, and add `search-starter-page` to the body if you use the standalone page styles.

Load `SearchApp.jsx` with server rendering disabled from a Client Component. The SearchStax kit mounts against the browser DOM.

```jsx
// app/search/SearchClient.jsx
'use client';

import dynamic from 'next/dynamic';

export default dynamic(() => import('./SearchApp.jsx'), {
  ssr: false,
  loading: () => <p role="status">Loading search…</p>,
});
```

Render `<SearchClient />` from your route’s `page.jsx`. [Next.js client-only loading](https://nextjs.org/docs/app/guides/lazy-loading)
