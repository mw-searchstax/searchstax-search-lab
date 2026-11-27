# Search Lab UI Kit coverage

**Design review for Thomas, Sabrina, and Kaunaj · November 25, 2026**

### Result cards

In Build, open **Appearance → Result cards** to show and size the sample thumbnails, style the content-type ribbon, or change a metadata label. The recorded **rehabilitation** example includes two practice fields, **Sample topic** and **Sample audience**. Under **Features → Advanced Options**, place the thumbnail above or beside the text and move metadata fields earlier or later. The field selectors list metadata in the current results. Clearing a label restores its original label. **Use profile order** restores the original field order for that profile and language.

| Open matrix item | Example needed |
|---|---|
| Grouped results | A profile with a groupable field, a tested JavaScript kit upgrade and a demonstration of counts and paging across groups in ordinary and tabbed exports. |
| Smart Answers feedback and conversation | An enabled profile with a real answer, an agreed feedback destination and a working follow-up conversation. Decide whether the pilot needs either interaction before adding controls. |
| Location search | Indexed coordinates, a geocoder and a location-enabled profile. Show manual entry, denied location permission and a radius that changes the results. |

Start in Build with **rehabilitation**. Under **Appearance → Hit highlighting**, switch from Italic to Plain text and compare the passage. Then enable profile tabs in Advanced Options and switch from SearchLabBuild to Main Profile. The wording can change when the app stops returning the matched passage. Changing its visual style should preserve every word.

The ten widget families below follow the [Help Center catalog](https://support.searchstax.com/hc/en-us/articles/40396499930381-Common-Widget-Configuration). Each section links the four framework references. The final section covers the wrapper, hooks and the JavaScript upgrade. Each row states what a visitor can see today, what the designer can change or should be able to change, and what data makes that choice demonstrable.

**Reading the starter columns.** JS, React, Vue and Angular refer to the ordinary downloaded starters. **Wired** means the template or connection implements the listed behavior by inspection. **Partial** means the paths differ as described in the review notes. **Fixed** means a value or treatment is built in. **Gap** means the proposed choice still needs implementation. **Setup** means the integrator supplies an endpoint, setting, or callback. **Upgrade** means the pinned JS interface lacks the option. Runtime evidence is recorded separately below. A package declaration alone earns no runtime verification. The tabbed and language exports for all four frameworks use one shared custom renderer.

**Placing a control.** Features contains everyday search behavior. Appearance changes how returned content looks. Advanced Options contains custom interactions and layouts, including Search Profile tabs. Handoff means developer-owned configuration or a template callback. In the tables, “Native” means a widget property, “template” includes framework slots, “CSS” means presentation only, and “app” means published Site Search configuration. A prerequisite hint belongs beside its editor control. Entitlement, published configuration and returned content are separate checks.


## Results and hit highlighting

[JavaScript reference](https://support.searchstax.com/hc/en-us/articles/40396449000205-JavaScript-Results-Widget) · [React reference](https://support.searchstax.com/hc/en-us/articles/40396474354573-React-Results-Widget) · [Vue reference](https://support.searchstax.com/hc/en-us/articles/40396900831373-Vue-Results-Widget) · [Angular reference](https://support.searchstax.com/hc/en-us/articles/40396244803981-Angular-Results-Widget)

| Option | Build today | Destination, mechanism and proposed default | Prerequisite or review example | JS | React | Vue | Angular |
|---|---|---|---|---|---|---|---|
| Hit highlighting | Returned fragments are displayed in mapped fields. | Appearance · CSS. Default emphasis, bold, italic, colored background or plain text. | Published highlighting and an actual fragment for this result and field. | Wired | Wired | Wired | Wired |
| Matched text color | Color picker in colored-background mode. | Appearance · CSS. Default dark ink #202020. Use accessible ink if the pair is below 4.5:1. | Same returned match and selected background. | Wired | Wired | Wired | Wired |
| Highlight background | Color picker and numeric contrast feedback. | Appearance · CSS. Default #ffec99. Use system colors in forced-colors mode. | Try pale text on a pale background, then plain text. | Wired | Wired | Wired | Wired |
| Snippet count | The profile supplies the passage. | App · retain the published snippet count. Build styles the text returned. | SearchLabBuild reports three. A missing fragment falls back to the field value. | Setup | Setup | Setup | Setup |
| Result list template | List or cards with configurable spacing and dividers. | Appearance · CSS and template. List, standard spacing, dividers on. | Multiple results and a narrow viewport. | Wired | Wired | Wired | Wired |
| Result item template | Mapped URL, title, description, date, paths, distance, ribbon, thumbnail and unmapped values. | Handoff · template. Use the profile’s ordered Results Fields and returned values. | Switch between two profiles with different field names. Search Fields control ranking. | Partial | Partial | Partial | Partial |
| Thumbnail sizing | Small, Standard or Large. | Appearance · CSS. Standard starts at 12rem. Images retain their proportions and shrink to fit. | A result with a mapped image. | Wired | Wired | Wired | Wired |
| Thumbnail placement | Above or beside the card text. | Advanced Options · template and CSS. Above by default. | Test a narrow card and a card without an image. | Wired | Wired | Wired | Wired |
| Ribbon appearance | Choose a ribbon, pill or square shape. Clear **Use accent color** to pick a custom ribbon color. | Appearance · CSS. Follow the accent color by default and choose contrasting text automatically. | Content type mapped to Ribbon. | Wired | Wired | Wired | Wired |
| Metadata labels | Rename an individual returned metadata field. | Appearance · template. Start with the profile label. Save overrides by field, profile and language. | Two fields and a result missing one of them. | Wired | Wired | Wired | Wired |
| Metadata order | Move a metadata field earlier or later. | Advanced Options · template. Default to the published field order within the metadata region. | Two fields, a profile change and a saved design. | Wired | Wired | Wired | Wired |
| `linkTarget` | Preview and handoff paths have fixed link behavior. | Features · native after upgrade, or template for custom links. Start with same tab, offer new tab. | Mapped HTTP(S) URL. Verify keyboard activation and result-click tracking. | Upgrade | Gap | Gap | Gap |
| `groupedBy` | Flat list. | Features · native after upgrade. Off, then one supported field. | A groupable field and at least two groups. Confirm counts on a running export. | Upgrade | Gap | Gap | Gap |
| `itemsPerGroup` | No group size. | Features · native after upgrade. Start with kit default when grouping is selected. | Group with multiple hits. Page size no longer directly sets the number of groups or documents. | Upgrade | Gap | Gap | Gap |
| Group heading | No groups. | Appearance · template and CSS. Start with the group value as its heading. | Two distinct group values and a missing value. | Gap | Gap | Gap | Gap |
| `renderMethod` | Paged results or Load more. | Features · start paged. The pager requests each batch and the result template retains earlier cards. | More than one page, including a final partial batch. | Wired | Wired | Wired | Wired |
| `resultsPerPage` | 5, 10 or 20 in Advanced Options. | Advanced Options · native widget size plus custom pager coordination. Default 10. | Ungrouped results exceeding the chosen size. | Wired | Wired | Wired | Wired |
| Empty-result template | Custom empty-state wording. | Appearance · template. Keep the current no-match message. | A query with zero results and a successful response. | Wired | Wired | Wired | Wired |
| `afterLinkClick` | Click tracking uses result IDs where enabled. | Handoff · native hook. Preserve link destination and opt-in tracking. | A returned unique ID and developer analytics setup. | Setup | Setup | Setup | Setup |

## Search input and autosuggest

[JavaScript reference](https://support.searchstax.com/hc/en-us/articles/40396451859341-JavaScript-Input-Widget) · [React reference](https://support.searchstax.com/hc/en-us/articles/40396500750221-React-Input-Widget) · [Vue reference](https://support.searchstax.com/hc/en-us/articles/40396456752269-Vue-Input-Widget) · [Angular reference](https://support.searchstax.com/hc/en-us/articles/40396244390669-Angular-Input-Widget)

| Option | Build today | Destination, mechanism and proposed default | Prerequisite or review example | JS | React | Vue | Angular |
|---|---|---|---|---|---|---|---|
| Input template | Custom form, field label and submit text. | Appearance · template. Start with “Search the website” and “Search”. | Submit with both Enter and the button. | Wired | Wired | Wired | Wired |
| Suggestions | Sample suggestions and a connected suggester. | Features · app and template. Follow available connection and configured minimum. | A working suggester and a matching prefix. | Wired | Wired | Wired | Wired |
| `suggestAfterMinChars` | Use the source’s minimum or set a higher one in the shared suggestion control. | Features → Search box → Minimum characters for suggestions. | With the connected-profile fixture, raise the minimum from three to four. Type **cam**, then **camp**, and select a suggestion with the keyboard. | Wired | Wired | Wired | Wired |
| Autosuggest item template | Standard or Compact rows with optional typed-text emphasis. | Appearance → Search suggestions. Standard spacing and plain text by default. | Open the fixture suggestions for **camp**. Check the matching text, row spacing, and keyboard selection. | Wired | Wired | Wired | Wired |
| `beforeAutosuggest` | No author-supplied callback. | Handoff · native hook. Pass term and query parameters through. | Configured suggester. | Setup | Setup | Setup | Setup |
| `afterAutosuggest` | Response normalization in custom suggestion source. | Handoff · native hook. Keep response order by default. | A nonempty suggestion response. | Setup | Setup | Setup | Setup |
| `searchInputId` | Inputs have fixed labels and IDs. | Handoff · template binding. Keep a unique input ID per instance. | Label association and two mounted forms. | Fixed | Fixed | Fixed | Fixed |

## Facets

[JavaScript reference](https://support.searchstax.com/hc/en-us/articles/40396436840333-JavaScript-Facets-Widget) · [React reference](https://support.searchstax.com/hc/en-us/articles/40396500364173-React-Facets-Widget) · [Vue reference](https://support.searchstax.com/hc/en-us/articles/40396456417421-Vue-Facets-Widget) · [Angular reference](https://support.searchstax.com/hc/en-us/articles/40396218894221-Angular-Facets-Widget)

| Option | Build today | Destination, mechanism and proposed default | Prerequisite or review example | JS | React | Vue | Angular |
|---|---|---|---|---|---|---|---|
| Facet visibility | Can show or hide filters. | Features · widget mount. Start visible when facets exist. | Returned facet values. | Wired | Wired | Wired | Wired |
| Desktop and mobile placement | Desktop sidebar or top, mobile filter control. | Advanced Options · template and CSS. Sidebar first, responsive mobile panel. | Mobile and desktop widths, focus on close. | Wired | Wired | Wired | Wired |
| `specificFacets` | Choose which facet groups appear and move them earlier or later. | Features → Filters and sorting. Defaults to all returned groups in profile order. Ordinary starters bind the saved list to the widget. | Two facet groups. Hide an active group and check the remaining filter and result count. | Wired | Wired | Wired | Wired |
| `facetingType` | Build and downloads offer OR, AND, One value per group, and Show unavailable. | Features · native in ordinary starters, request logic in connected and tabbed previews. Default OR. | Location and Providers on SearchLabBuild. | Wired | Wired | Wired | Wired |
| Facet tabs | **One value per group** replaces the previous value in the same group and combines selections from different groups with AND. | Features → Filters and sorting · UI Kit `tabs` mode. | Replace North with South while Location stays selected on the same profile. | Wired | Wired | Wired | Wired |
| `itemsPerPageDesktop` | Choose 3, 5, 10 or 20 visible values before Show more. | Features · responsive facet template. Default 20. | Nine published content types for campus. | Wired | Wired | Wired | Wired |
| `itemsPerPageMobile` | Independent mobile value limit. | Features · responsive facet template. Default 20. Keep selected values visible when collapsed. | Nine content types on a narrow viewport. | Wired | Wired | Wired | Wired |
| `beforeFacetsRender` | Rendering uses response labels or demo labels. | Handoff · native hook. Preserve order unless the design requests a change. | Facet counts and disabled values survive the callback. | Setup | Setup | Setup | Setup |
| Desktop facets template | Custom desktop grouping and choices. | Handoff · template. Follow the saved appearance and placement. | Two facet groups. | Wired | Wired | Wired | Wired |
| Mobile facets template | Custom responsive controls. Ordinary framework exports reuse desktop UI on small screens. | Handoff · template. Maintain labels, open/close focus and selected filters. | Narrow viewport and a selected filter. | Fixed | Fixed | Fixed | Fixed |

## Sorting

[JavaScript reference](https://support.searchstax.com/hc/en-us/articles/40396453220109-JavaScript-Sorting-Widget) · [React reference](https://support.searchstax.com/hc/en-us/articles/40396502247565-React-Sorting-Widget) · [Vue reference](https://support.searchstax.com/hc/en-us/articles/40396901328909-Vue-Sorting-Widget) · [Angular reference](https://support.searchstax.com/hc/en-us/articles/40396235563277-Angular-Sorting-Widget)

| Option | Build today | Destination, mechanism and proposed default | Prerequisite or review example | JS | React | Vue | Angular |
|---|---|---|---|---|---|---|---|
| Sort visibility | Can hide or show the selector. | Features · widget or custom selector. Start visible when options are available. | Current profile’s sort options. | Wired | Wired | Wired | Wired |
| Sort label | Editable text labels the visitor’s dropdown. | Appearance → Sorting · template. Defaults to **Sort by**. | At least one published sort. | Wired | Wired | Wired | Wired |
| Sort placement | Above or below the results. | Features → Advanced Options · layout. Defaults to **Above results**. | At least one published sort. | Wired | Wired | Wired | Wired |
| Initial selection | Relevance or a sort returned by the active profile. Visitors can change it. | Features → Filters and sorting · request and selector. **Relevance** keeps the profile’s default order. | If the selected sort is unavailable, use relevance. | Wired | Wired | Wired | Wired |
| Sorting template | Custom dropdown in ordinary exports. | Handoff · template. Retain option keys and accessible label. | Sorting metadata. | Wired | Wired | Wired | Wired |

## Pagination

[JavaScript reference](https://support.searchstax.com/hc/en-us/articles/40396448723597-JavaScript-Pagination-Widget) · [React reference](https://support.searchstax.com/hc/en-us/articles/40396459367053-React-Pagination-Widget) · [Vue reference](https://support.searchstax.com/hc/en-us/articles/40396916092813-Vue-Pagination-Widget) · [Angular reference](https://support.searchstax.com/hc/en-us/articles/40396265219853-Angular-Pagination-Widget)

| Option | Build today | Destination, mechanism and proposed default | Prerequisite or review example | JS | React | Vue | Angular |
|---|---|---|---|---|---|---|---|
| Paged navigation template | Previous and Next and result range. | Appearance · template. Keep existing labels and let designers change each. | A first, middle and last page. | Fixed | Fixed | Fixed | Fixed |
| Infinite-scroll template | Load more button with editable text and a cumulative count. | Features → Pagination · widget and template. The default button text is “Load more.” | More than one page, with keyboard focus and an end-of-results message. | Wired | Wired | Wired | Wired |
| Multiple pagination instances | Previous and Next controls can appear above results, below results, or in both places. | Advanced Options → Pagination placement. Default below. Both controls share the active page. | Advance from above and return from below. Check both ranges, the request count, and keyboard focus at page boundaries. | Wired | Wired | Wired | Wired |
| Range text | Range appears as results are paged. | Appearance · template. Start with the existing range and total. | Final partial page. | Fixed | Fixed | Fixed | Fixed |

## Search feedback and spelling

[JavaScript reference](https://support.searchstax.com/hc/en-us/articles/40396437002893-JavaScript-Feedback-Widget) · [React reference](https://support.searchstax.com/hc/en-us/articles/40396470745869-React-Feedback-Widget) · [Vue reference](https://support.searchstax.com/hc/en-us/articles/40396472815629-Vue-Feedback-Widget) · [Angular reference](https://support.searchstax.com/hc/en-us/articles/40396249193613-Angular-Feedback-Widget)

| Option | Build today | Destination, mechanism and proposed default | Prerequisite or review example | JS | React | Vue | Angular |
|---|---|---|---|---|---|---|---|
| Feedback or overview template | Result count or visible range above or below results. Load more reports the accumulated range. | Appearance → Search feedback · response data and template. Default to the count above results. | Use the campus fixture to page, append, filter to Location, and clear. A search with zero hits shows a count in either mode. | Wired | Wired | Wired | Wired |
| Corrected query | Build has no complete live correction presentation. | Features · response and template. Display corrected and original terms when supplied. | A real misspelling with a corrected-query response. | Gap | Gap | Gap | Gap |
| Retry original query | No live original-query action in Build. | Features · native feedback action or custom template. Offer only when the response includes an original term. | Retry must suppress correction for that request. | Gap | Gap | Gap | Gap |

## External and indexed promotions

[JavaScript reference](https://support.searchstax.com/hc/en-us/articles/40396451303181-JavaScript-External-Promotions-Widget) · [React reference](https://support.searchstax.com/hc/en-us/articles/40396439264525-React-External-Promotions-Widget) · [Vue reference](https://support.searchstax.com/hc/en-us/articles/40396456271757-Vue-External-Promotions-Widget) · [Angular reference](https://support.searchstax.com/hc/en-us/articles/40396187141645-Angular-External-Promotions-Widget)

| Option | Build today | Destination, mechanism and proposed default | Prerequisite or review example | JS | React | Vue | Angular |
|---|---|---|---|---|---|---|---|
| External promotions template | Shows the links and descriptions returned for the query. | Appearance · template and CSS. Edit the “Featured link” heading and choose a tinted card (default) or outline. | Published external item with an HTTP or HTTPS destination. | Wired | Wired | Wired | Wired |
| External item placement | Places returned banners above or below results. | Advanced Options · layout. Above results by default. | Compare the trigger with a query that returns no banner. | Wired | Wired | Wired | Wired |
| Indexed promotion | Keeps the response order and labels results marked as elevated. | App and result template. The selected profile supplies the promotion. | Published indexed trigger and an identifiable elevated result. | Wired | Wired | Wired | Wired |
| Indexed badge text and styling | Labels each elevated result. | Appearance · template and CSS. Edit “Promoted” and choose text (default) or an outlined pill. | Compare the elevated result with the next result. | Wired | Wired | Wired | Wired |

## Related Searches

[JavaScript reference](https://support.searchstax.com/hc/en-us/articles/40396448868109-JavaScript-Related-Searches-Widget) · [React reference](https://support.searchstax.com/hc/en-us/articles/40396459736461-React-Related-Searches-Widget) · [Vue reference](https://support.searchstax.com/hc/en-us/articles/40396908658061-Vue-Related-Searches-Widget) · [Angular reference](https://support.searchstax.com/hc/en-us/articles/40396219579533-Angular-Related-Searches-Widget)

| Option | Build today | Destination, mechanism and proposed default | Prerequisite or review example | JS | React | Vue | Angular |
|---|---|---|---|---|---|---|---|
| `relatedSearchesURL` | Optional Discovery connection. | Handoff · app. Obtain a browser-safe endpoint. Leave blank for unconfigured apps. | Discovery service and published language setting. | Setup | Setup | Setup | Setup |
| `relatedSearchesAPIKey` | Optional Discovery key. | Handoff · app. Supply only a browser-appropriate key during integration. | Entitlement, language setting and endpoint all available. | Setup | Setup | Setup | Setup |
| Related searches template | App-aware suggestions and separate fictional examples with an editable heading. | Appearance → Related searches. Leave Heading blank to use the default. | A query with returned suggestions in the chosen language. | Wired | Wired | Wired | Wired |
| Related item template | Outlined buttons or Chips, with Standard or Compact spacing. | Appearance → Related searches. Outlined buttons and Standard spacing are the defaults. | Keyboard activation submits the suggested query. | Wired | Wired | Wired | Wired |
| Placement | Above or below the results. | Advanced Options · template. Default below. | Switch language and profile. Omit the block for an empty response. | Wired | Wired | Wired | Wired |

## Smart Answers

[JavaScript reference](https://support.searchstax.com/hc/en-us/articles/40396228825613-JavaScript-Answer-Widget) · [React reference](https://support.searchstax.com/hc/en-us/articles/40396458344077-React-Answer-Widget) · [Vue reference](https://support.searchstax.com/hc/en-us/articles/40396502539917-Vue-Answer-Widget) · [Angular reference](https://support.searchstax.com/hc/en-us/articles/40335188064653-Angular-Answer-Widget)

| Option | Build today | Destination, mechanism and proposed default | Prerequisite or review example | JS | React | Vue | Angular |
|---|---|---|---|---|---|---|---|
| Answer availability | Configured answers can stream, with sources. Samples live in the fictional experience. | Features · app and template. Follow both entitlement and profile configuration. | Answer endpoint and an answerable query. Handle empty/error responses. | Wired | Wired | Wired | Wired |
| Answer template | One heading and answer card. | Appearance · template and CSS. Start with current heading and card, make heading and treatment editable. | A streamed answer. | Gap | Gap | Gap | Gap |
| Citation styling | Source links in the connected answer. | Appearance · CSS and template. Preserve link labels and order. | An answer with sources. | Gap | Gap | Gap | Gap |
| `showMoreAfterWordCount` | No word-count control. | Features · native. Start at 100 words, allow adjustment. | A long answer. Check expand/collapse in each kit. | Gap | Gap | Gap | Gap |
| `feedbackwidget` | No answer feedback choice. | Features · native. Default off, opt in when integration is configured. | A real answer plus approved feedback destination. | Gap | Gap | Gap | Gap |
| `renderFeedbackWidget` | No thumbs controls in the custom card. | Features · native feedback config. Off initially. | An answer eligible for feedback. | Gap | Gap | Gap | Gap |
| `emailOverride` | No identity override. | Handoff · callback. Unset by default. | Integrator-owned identity and feedback policy. | Setup | Setup | Setup | Setup |
| `searchstaxFeedbackTextAreaOverride` | No custom comment prompt. | Handoff · callback. Use kit prompt initially. | Feedback integration. | Setup | Setup | Setup | Setup |
| `lightweightTemplateOverride` | No lightweight feedback template. | Handoff · template. Use kit rendering initially. | Feedback integration. | Setup | Setup | Setup | Setup |
| `thumbsUpValue` | No custom positive feedback score. | Handoff · native. Retain kit default. | Feedback analytics mapping. | Setup | Setup | Setup | Setup |
| `thumbsDownValue` | No custom negative feedback score. | Handoff · native. Retain kit default. | Feedback analytics mapping. | Setup | Setup | Setup | Setup |
| `isFullScreenConversation` | No conversation preview. | Advanced Options · version-dependent native option. Off initially. | A conversation-enabled app and working end-to-end exchange in the specific kit. | Gap | Gap | Gap | Gap |
| `emptyConversationMessageOverride` | No conversation empty-state editor. | Appearance · version-dependent native option. Start with kit message. | An empty conversation in the supported kit. | Gap | Gap | Gap | Gap |
| `testString` | No public control. | Handoff · package test input. Leave unset. | Local development only. | Setup | Setup | Setup | Setup |

## Location

[JavaScript reference](https://support.searchstax.com/hc/en-us/articles/40396452475277-JavaScript-Location-Widget) · [React reference](https://support.searchstax.com/hc/en-us/articles/40396440021133-React-Location-Widget) · [Vue reference](https://support.searchstax.com/hc/en-us/articles/40396892409485-Vue-Location-Widget) · [Angular reference](https://support.searchstax.com/hc/en-us/articles/40396219310989-Angular-Location-Widget)

| Option | Build today | Destination, mechanism and proposed default | Prerequisite or review example | JS | React | Vue | Angular |
|---|---|---|---|---|---|---|---|
| `locationSearchEnabled` | Mapped distance may appear. No location input. | Features · native. Follow app capability and start with published configuration. | Indexed coordinates and location-enabled profile. | Gap | Gap | Gap | Gap |
| Location template | No input label or placement choice. | Appearance · template. Accessible place label, then Advanced Options for placement next to search. | Geocoding integration and a location-enabled query. | Gap | Gap | Gap | Gap |
| `locationValuesOverride` | No overrides. | Handoff · native object. Use the profile’s radius settings as defaults. | Published location configuration. | Setup | Setup | Setup | Setup |
| `locationDistanceEnabled` | No radius selector. | Features · native. Follow app setting. | Distance filtering and a mapped coordinate field. | Gap | Gap | Gap | Gap |
| `filterValues` | No radius choices. | Features · native. Offer configured radii in configured order. | Two supported radii returning different sets. | Gap | Gap | Gap | Gap |
| `filterUnit` | Mapped distance displays returned units. | Features · native. Follow profile units. | Known distance and matching radius units. | Gap | Gap | Gap | Gap |
| `locationFilterDefaultValue` | No default radius control. | Features · native. Use published default, then select from available radii. | A selectable radius and a result near its boundary. | Gap | Gap | Gap | Gap |
| Geocoding endpoint (`geocodingURL` in the examples) | No provider connection | Handoff · choose the provider endpoint in the decode callback. Leave unset initially. | A service that resolves places to coordinates. | Setup | Setup | Setup | Setup |
| Geocoding credential (`geocodingAPIKey` in the examples) | No provider key | Handoff · use the provider’s approved credential flow for that callback. | Provider account and intended audience for the credential. | Setup | Setup | Setup | Setup |
| Current location action | No geolocation button. | Features · template and native action. Off until supported. Offer a labeled action. | Secure origin and user permission. Test denial and manual entry. | Gap | Gap | Gap | Gap |
| `locationDecode` | No geocoder. | Handoff · callback. Supply the chosen forward geocoder. | Provider endpoint and a valid place. | Setup | Setup | Setup | Setup |
| `locationDecodeCoordinatesToAddress` | No reverse geocoder. | Handoff · callback. Use only for a supported current-location experience. | Provider and coordinates. Test an unavailable lookup. | Setup | Setup | Setup | Setup |

## Wrapper and developer handoff

| Option | Build today | Destination, mechanism and proposed default | Prerequisite or review example | JS | React | Vue | Angular |
|---|---|---|---|---|---|---|---|
| `searchURL` | SearchLabDemo or connected app. | Handoff · native. Use app’s HTTPS Select endpoint. | Browser-safe read access. | Setup | Setup | Setup | Setup |
| `searchAuth` | Built-in read-only connection or transient supplied token. | Handoff · native. Supply your own browser-appropriate credential. | Authorized search endpoint. | Setup | Setup | Setup | Setup |
| `authType` | Token authentication. | Handoff · native. Default token. Keep server credentials on the server. | Integration authentication mode. | Fixed | Fixed | Fixed | Fixed |
| `model` | Build can use a distinct default and individual profile tabs. | Advanced Options · app and custom navigation. Use selected profile. | Verified app-scoped catalog. | Wired | Wired | Wired | Wired |
| `language` | Language-aware profiles and suggestions. | Advanced Options · app and custom language picker. Start in the default profile language. | Catalog with language-specific profiles. | Wired | Wired | Wired | Wired |
| `sessionId` | No designer override. | Handoff · native. Use the integration’s session policy. | Analytics session policy. | Setup | Setup | Setup | Setup |
| `suggesterURL` | Optional app suggester. | Handoff · native connection or custom source. Empty until configured. | App suggester endpoint. | Setup | Setup | Setup | Setup |
| `questionURL` | Optional connected answer endpoint. | Handoff · native connection or streaming implementation. Empty until configured. | Entitled and configured Smart Answers. | Setup | Setup | Setup | Setup |
| `autoCorrect` | No Build switch. | Features · native. Inherit app behavior unless explicitly overridden. | Configured correction dictionary and a misspelling. | Gap | Gap | Gap | Gap |
| `trackApiKey` | Tracking opt-in in ordinary starters. | Handoff · native. Off by default. | Browser-appropriate tracking key. | Setup | Setup | Setup | Setup |
| `analyticsBaseUrl` | Optional tracking destination. | Handoff · native. Empty until configured. | Approved analytics destination. | Setup | Setup | Setup | Setup |
| `analyticsSrc` | No source override in Build. | Handoff · native. Use integration default. | Analytics source configuration. | Setup | Setup | Setup | Setup |
| `router.enabled` | Ordinary starters disable kit routing. | Handoff · native. Off, let the host opt in. | Host page URL ownership. | Fixed | Fixed | Fixed | Fixed |
| `router.routeName` | No route namespace control. | Handoff · native. Keep kit default. | Enabled router. | Setup | Setup | Setup | Setup |
| `router.ignoredKeys` | No ignored parameter control. | Handoff · native. Keep defaults. | Host query parameters to preserve. | Setup | Setup | Setup | Setup |
| `router.title` | No document-title callback. | Handoff · callback. Use host title policy. | Enabled router. | Setup | Setup | Setup | Setup |
| `beforeSearch` | Preview builds search requests internally. | Handoff · native hook. Preserve request unless explicitly transforming it. | Query, page, profile, facets and sort. | Setup | Setup | Setup | Setup |
| `afterSearch` | Reads original response and mapped passages. | Handoff · native hook. Preserve IDs, field mappings and highlight boundaries. | Search response with metadata. | Wired | Wired | Wired | Wired |
| `initialized` | Framework starters capture the initialized instance. | Handoff · lifecycle. Subscribe once and release subscriptions on teardown. | Mounted wrapper. | Setup | Wired | Wired | Wired |

## Shared styling and custom interactions

The kits document three styling paths. Import the distributed theme, override selected CSS classes, or compile a custom theme from the SCSS source. The downloads use scoped Search Lab CSS to reproduce the saved design. A developer can adapt those selectors to other markup. [Common styling](https://support.searchstax.com/hc/en-us/articles/40396457923085-Common-Styling)

| Option | Build today | Destination and default | Prerequisite | JS | React | Vue | Angular |
|---|---|---|---|---|---|---|---|
| Theme stylesheet | Search Lab design stylesheet | Handoff · import the generated CSS with the starter | Matching starter markup | Wired | Wired | Wired | Wired |
| CSS overrides | Editable colors, typefaces, spacing, corners and title underlining | Appearance · use the saved design variables | Visible controls and results | Wired | Wired | Wired | Wired |
| Custom SCSS theme | No SCSS editor | Handoff · optional kit theme source and mixins | Integrator’s stylesheet build | Setup | Setup | Setup | Setup |
| Profile tabs | Select profiles from the current app catalog | Advanced Options · custom interaction, initially off | More than one included profile in the same language | Wired | Wired | Wired | Wired |
| Language picker | Shows profiles available in the selected language | Advanced Options · custom interaction, initially off | Catalog with multiple languages | Wired | Wired | Wired | Wired |

The last two rows refer to the profile-navigation exports. In the local result-card fixture, the ordinary starters previously dropped the two results without a URL and omitted both mapped thumbnails. Build and the profile-tab starters kept all four results. The result-card regression now covers these four cases plus invalid addresses and an image that returns a 404. It exercises the five card controls, reload, share links and running ordinary and profile-tab downloads in JavaScript, React, Vue and Angular at desktop and phone widths. The result-item template still has separate checks for other mapped field types.

All four ordinary exports carry the selected app’s language-scoped Related Searches setting and profile-scoped Smart Answers setting. The explicit fictional demo supplies sample related terms, answers and promotions.

The English SearchLabBuild profile has one exact-match rule for **campus flu clinic**. It elevates the 2026 flu clinic notice and returns an external link to flu shot appointment information. **Rehabilitation** is a control query. The campus query returned neither promotion on Main Profile, SearchLabAfter or SearchLabRanking in the November 25, 2026 check.

On November 25, the ordinary and tabbed Build previews displayed both published items. The JavaScript, React, Vue and Angular downloads each showed the notice first with a custom outlined badge and the appointment link below results with a custom heading and outline. The control query cleared both. All four fictional downloads displayed the sample promotions without calling the live search endpoint. The share link restored all five design choices and Download CSS carried the selected treatments.

Local download verification on November 24, 2026 covered JavaScript, React, Vue and Angular. Each ran **rehabilitation** against the live English SearchLabBuild profile, showed highlighted results and made zero Discovery or Answer requests. In an isolated connected-app fixture, each displayed returned terms and a streamed answer. Choosing a returned term submitted it to the same profile and language. Independent settings produced suggestions alone or an answer alone. Unknown settings, missing credentials or service endpoints, a different app, a different language, and absent entitlements suppressed the corresponding requests. The explicit fictional download in each framework displayed the fixed suggestions and answer for the same query.

### Published facets

On November 25, 2026, the local ordinary and tabbed previews and the JavaScript, React, Vue and Angular downloads used SearchLabBuild’s published Content type facet. Searching **campus** returned 37 results. Selecting **Location** returned eight cards with the **Location** ribbon. Clearing it restored 37. In OR mode, adding **Providers** returned 16. AND mode narrowed the choices to Location, and Show unavailable kept the other choices visible and disabled. All four downloads honored independent limits of three desktop values and five mobile values.

In Build, open **Features → Filters and sorting → Filter groups** to show, hide or move groups. Hiding a group clears its active filters. **Use profile defaults** restores all returned groups in profile order. The design and shared link save choices by profile and language. The local **campus** fixture adds **Campus area**. In AND mode, selecting **North**, then **Location**, shows 13 and then three results. Hiding **Campus area** restores the eight Location results.

Under **Match selected filter values**, choose **One value per group**. With the same local fixture, select **North** and **Location** to get three results. Select **South** to replace **North** and get five. Clear **South** to return to the eight Location results.

### Load more

In **Features → Pagination**, choose **Load more**. Paged results are the default for new and existing designs. The button uses the batch size set in Advanced Options. Its label and the selected mode are saved in the design, share link, and starter downloads.

On November 25, 2026, the ordinary and tabbed Build previews loaded **campus** on English SearchLabBuild in batches of 10, 10, 10, and seven. The ordinary preview kept the first 10 cards after a failed second request and showed 20 distinct cards after retry. Changing the sort or switching profiles started a fresh list.

The JavaScript, React, Vue and Angular downloads each ran the same query locally with a custom button label. Keyboard activation showed 10, 20, 30, then 37 distinct results in order, with a visible final count. Selecting **Location** showed eight results. Clearing it restored the first 10 of 37.

### Pagination placement

For Previous/Next pagination, open **Features → Advanced Options → Pagination placement**. Choose **Above results**, **Below results**, or **Both**. With **Both** and the local `campus` fixture, **Next** above the results moves both ranges to **11–20 of 37**. **Previous** below the results returns both to **1–10 of 37**. Keyboard focus stays with the pager used and moves to its range when that direction is unavailable.

### Minimum characters for suggestions

In **Features → Search box**, leave **Minimum characters for suggestions** blank to use the source’s minimum. Sample suggestions start at three characters. A connected preview can make an initial request from two characters to learn the app’s minimum. Once the app reports its minimum, the search box uses the higher of that minimum and the design setting.

The setting is saved in the Build draft, share link, and starter configuration. The connected-profile fixture reports a minimum of three characters.

Local QA covered Build and the ordinary and profile variants for JavaScript, React, Vue, and Angular. With a minimum of four, **cam** sent no request and **camp** opened the list. Arrow keys and Enter submitted the selected term in the active language.

### Search suggestion styling

In **Appearance → Search suggestions**, set **Row spacing** to **Standard** or **Compact**. Turn on **Emphasize typed text** to bold matching text regardless of case. With the connected-profile fixture, type **camp** to see the match in **Campus clinic** and **Campus library**. **Visitor information** stays plain. Both settings are saved in the Build draft, share link, and starter configuration.

### Related Searches appearance

In **Appearance → Related searches**, leave **Heading** blank to use the default. Choose **Outlined buttons** or **Chips**, and set **Item spacing** to **Standard** or **Compact**. Compact spacing brings items closer together while keeping their padding. The heading and both styling choices are saved in the Build draft, share link, and starter configuration.

Local fixture QA covered Build and the ordinary and profile variants for JavaScript, React, Vue, and Angular. **campus** returned two related searches in English and Spanish. Enter and Space submitted the full selected term in the active language and profile. **visitor maps** returned search results with no Related Searches section.

### Result summary

Local fixture QA on November 25, 2026 covered Build and 16 starter ZIPs, four designs in each framework. Paging showed **1–10**, **11–20**, **21–30**, and **31–37 of 37**. Load more kept the start at **1**. Selecting **Location** showed **1–8 of 8**, and clearing it restored **1–10 of 37**. Both placements, count-only summaries, one hit, zero hits, saved designs, and share links passed. The tabbed and connected previews also updated their summaries on page two without a new search.

### Published URL sorts

SearchLabDemo’s English SearchLabBuild profile publishes **Page address (A–Z)** and **Page address (Z–A)**. With **campus**, relevance returns **North Campus Clinic** first. Sorting the 37 results by ascending URL puts **Central County University Health** first. Descending URL puts **Sleep Health Center** first. The November 25 API check found neither option in the published metadata for Main Profile, SearchLabAfter or SearchLabRanking.

Build reads the active profile’s published sort names and labels from its search response. A saved design can set the initial order. The visitor can then change the order for subsequent searches. Use the same **campus** query in each starter to compare the result URLs.

Local browser QA used a 37-result fixture based on the published sort labels and the three first-result titles above. The preview and all twelve starter configurations (three starting sorts in four frameworks) showed the configured label and placement and returned the expected first page for every order. SearchLabDemo reached its monthly request limit before a full live browser check.

## Template bindings for the developer handoff

Each row is a distinct replacement point. Keep the kit template by default when building a new native integration. The Build column identifies the current equivalent and the user-facing row above supplies its design defaults and app prerequisites. Custom templates own the accessible controls, result IDs and callbacks inside them. These are package bindings for implementation review. Runtime verification applies only to the behaviors recorded below.

| Option | Build equivalent or gap | JavaScript `templates` entry | React render prop | Vue slot | Angular template input |
|---|---|---|---|---|---|
| Input shell | Search form | mainTemplate | inputTemplate | input | templateOverride |
| Suggestion row | Existing list, fixed appearance | autosuggestItemTemplate | within inputTemplate | within input | within templateOverride |
| Results list | List/card layout | mainTemplate | resultsTemplate | results | resultsTemplate |
| Result item | Mapped card and returned fragment | searchResultTemplate | within resultsTemplate | within results | within resultsTemplate |
| No matches | Editable empty-state text | noSearchResultTemplate | noResultTemplate | noResult | noResultsTemplate |
| Desktop facet shell | Sidebar or top filters | mainTemplateDesktop | facetsTemplateDesktop | desktopFacets | templateOverrideDesktop |
| Mobile facet shell | Mobile filter panel | mainTemplateMobile | facetsTemplateMobile | mobileFacets | templateOverrideMobile |
| More facet values | Show more and Show less with separate desktop and mobile limits | showMoreButtonContainerTemplate | within facet templates | within facet slots | within facet templates |
| One facet group | Field label and choices | facetItemContainerTemplate | within facet templates | within facet slots | within facet templates |
| One facet value | Option, selection and count | facetItemTemplate | within facet templates | within facet slots | within facet templates |
| Clear all filters | No shared clear-all design option | clearFacetsTemplate | within facet templates | within facet slots | within facet templates |
| Open mobile filters | Mobile filter action | filterByTemplate | within mobile template | within mobileFacets | within mobile template |
| Selected filter chips | No chip treatment control | selectedFacetsTemplate | within facet templates | within facet slots | within facet templates |
| Pagination | Previous, range, next | mainTemplate | paginationTemplate | pagination | templateOverride |
| Load more | Load more button and cumulative count | infiniteScrollTemplate | infiniteScrollTemplate | infiniteScroll | infiniteScrollTemplateOverride |
| Count and corrections | Count, visible range and placement wired. Corrected-query display and retry remain open. | main | searchOverviewTemplate | searchFeedback | templateOverride |
| Sorting | Labeled dropdown above or below results | main | searchSortingTemplate | sorting | templateOverride |
| External promotions shell | Banner | mainTemplate | searchExternalPromotionsTemplate | externalPromotions | templateOverride |
| One external promotion | Fixed treatment | externalPromotion | within promotions template | within externalPromotions | within promotions template |
| Related Searches shell | Conditional suggestions | main | searchRelatedSearchesTemplate | related | templateOverride |
| One related search | Fixed link treatment | relatedSearch | within related template | within related | within related template |
| Answer | Streamed text and sources | main | searchAnswerTemplate | answer | templateOverride |
| Location | Gap | mainTemplate | searchLocationTemplate | location | templateOverride |

The JavaScript template objects also expose markup bindings. They belong in the developer handoff with the widget that uses them. Preserve the kit defaults unless supplying a replacement template. In React, Vue and Angular, use the corresponding slot, ref, template context or callback above.

| JS option | Widget and required effect | Current Build equivalent |
|---|---|---|
| template | Every replacement point supplies its markup | Custom templates and escaped text |
| searchInputId | Input, associate label and input | Labeled search field |
| searchResultsContainerId | Results, mount the result list | Results grid |
| searchResultUniqueIdAttribute | Results, associate clicks with documents | Mapped result ID |
| facetsContainerClass | Facets, mount groups | Facet list |
| selectedFacetsContainerClass | Facets, mount selected items | Fixed selection treatment |
| filterByContainerClass | Facets, mount mobile action | Mobile filter action |
| closeOverlayTriggerClasses | Facets, dismiss mobile overlay | Custom responsive panel |
| showMoreButtonClass | Facets, expand a group | No expansion control in Build |
| facetListTitleContainerClass | Facets, identify group heading | Field label |
| facetListTitleContainerInner | Facets, supply inner title markup | Fixed label |
| facetListContainerClass | Facets, mount choices | Group options |
| inputCheckboxClass | Facets, bind the checkbox | Checkbox or custom choice |
| checkTriggerClasses | Facets, bind optional selection targets | Fixed selection targets |
| containerClass | Facets, bind selected, clear or filter-by control | Custom filter panel |
| originalQueryClass | Feedback, retry the original spelling | Build integration gap |
| previousButtonClass | Pagination, go back one page | Previous button |
| nextButtonClass | Pagination, advance one page | Next button |
| loadMoreButtonClass | Pagination, append another batch | Load more button |
| relatedSearchesContainerClass | Related Searches, mount the list | Related suggestions |
| relatedSearchContainerClass | Related Searches, bind the suggestion | Clickable term |
| externalPromotionsContainerId | External Promotions, mount returned items | Promotion region |
| selectId | Sorting, bind the dropdown | Sort selector |
| locationInputId | Location, bind the address input | Build integration gap |
| radiusInputId | Location, bind radius choice | Build integration gap |
| currentLocationActionButtonId | Location, bind current location | Build integration gap |

## Version differences and upgrade checks

The pilot and ordinary JavaScript ZIP currently load core 4.2.34. The ordinary React, Vue and Angular ZIPs pin 4.2.70. The profile-tab ZIPs use the shared Search Lab renderer even when packaged in a framework shell. A successful tabbed test establishes parity for that renderer. Test the ordinary widget integration separately. [JS 4.2.34 declarations](https://cdn.jsdelivr.net/npm/@searchstax-inc/searchstudio-ux-js@4.2.34/dist/@searchstax-inc/searchstudio-ux-js.d.ts) · [JS 4.2.70 declarations](https://cdn.jsdelivr.net/npm/@searchstax-inc/searchstudio-ux-js@4.2.70/dist/@searchstax-inc/searchstudio-ux-js.d.ts)

| Option | JS 4.2.34 | JS 4.2.70 | React 4.2.70 | Vue 4.2.70 | Angular 4.2.70 |
|---|---|---|---|---|---|
| groupedBy | Absent | Declared | Declared | Declared | Declared |
| itemsPerGroup | Absent | Declared | Declared | Declared | Declared |
| linkTarget | Absent | Declared | Declared | Declared | Declared |
| isFullScreenConversation | Declared | Declared | Declared | Declared | Declared |
| emptyConversationMessageOverride | Declared | Declared | Declared | Declared | Declared |

The Answer articles use `showShowMoreAfterWordCount` and some use `feedbackWidget`. The pinned declarations use `showMoreAfterWordCount` and `feedbackwidget`. Angular’s empty result input is `noResultsTemplate`. Verify these spellings against a functioning widget. The release notes date React and Vue Smart Answers support to 4.2.50. Location examples also mention geocoding URLs and keys. They are provider integration details for the geocoding callbacks. [September release notes](https://support.searchstax.com/hc/en-us/articles/48974997007885-Site-Search-Release-Notes-September-17-2026)

1. Pin the candidate JS core in a task branch. Compare the initialization, response parsing, template contracts and click tracking with 4.2.34. Keep the present version available for rollback.
2. Run the same fixture and SearchLabBuild query against both versions. Check result IDs and fields, highlights, empty results, filters, sorting, pagination, focus recovery, Improve comparisons and all four downloads.
3. Exercise grouping with more than one group, varied group sizes and multiple pages. Exercise same/new-tab links with pointer and keyboard. Inspect the actual link target and result-click behavior in each ordinary export. Test the profile-tab renderer separately before exposing the same options there.
4. Add a public control once a designer can see its effect in Build, save/share it, and reproduce it in the relevant running starters. Gate answers, related suggestions, live promotions and location on a verified demonstration query or published trigger. An entitlement alone cannot supply a demonstration.

## Worked example and acceptance evidence

The English SearchLabBuild profile was copied from SearchLabDemo’s Main Profile. Its published Results Fields map URL, title, description and the content-type ribbon. Only SearchLabBuild was selected when publishing hit highlighting. A read-only search for **rehabilitation** returned eight documents with highlighting enabled and `hl.snippets=3`. The same query on Main Profile, SearchLabAfter and SearchLabRanking returned highlighting off. The signed-in administration page showed Smart Answers off on SearchLabBuild. The English Related Searches setting applies across profiles. [Results Fields](https://support.searchstax.com/hc/en-us/articles/40837318253197-Results-Fields) · [Hit-highlighting snippets](https://support.searchstax.com/hc/en-us/articles/40075178819213-Hit-Highlighting-Snippets)

An example returned passage begins “Rehabilitation links mock room plans, adaptable furniture, and accessibility design materials.” The service marks “Rehabilitation”. Both Italic and Plain text retain the complete passage. For a field without a fragment, compare against its original returned value.

| Downloaded starter | Ordinary export | Profile-tab export |
|---|---|---|
| JavaScript | Live query, exact description passages and italic style verified | Same checks, then Main Profile with highlighting off |
| React | Live query, exact description passages and italic style verified | Same checks, then Main Profile with highlighting off |
| Vue | Live query, exact description passages and italic style verified | Same checks, then Main Profile with highlighting off |
| Angular | Live query, exact description passages and italic style verified | Same checks, then Main Profile with highlighting off |

These runs used five results per page. Three descriptions on the first page had a returned passage. Their complete text matched in all eight apps. Two other descriptions used the original field values returned as arrays by the API. The CSS download matched the stylesheet in each ZIP. The tabbed downloads used the documented connection setup with the isolated app. Future widget rows still need their listed examples exercised in running exports before being marked verified.

To repeat the comparison, select Italic and set the page size to five under Advanced Options. Download each starter from Get starter code. Use its README to run it locally and submit **rehabilitation**. Compare the first page against the Build preview, including the two results that show an original description. Enable profile tabs, select SearchLabBuild, and repeat with fresh downloads. For those exports, supply the app’s read-only connection in the downloaded project as described in its README, then switch to Main Profile. The saved design and share link contain the presentation settings.

The local regression suite includes `qa/regression/hit-highlighting.cjs`. It uses controlled responses to test all five presentations, a result without a fragment, off and unknown settings, contrast fallback, forced colors, reload, sharing, reset and undo. The existing profile tests exercise missing mappings, late metadata and switching.
