import { strToU8, zipSync } from 'fflate';
import { designVariables, type DesignSettings } from './design';
import { demoThumbnails } from './demo-thumbnails';
import starterSorting from './starter/sorting.js?raw';
import htmlTemplate from './starter/index.html?raw';
import jsTemplate from './starter/search.js?raw';
import readme from './starter/README.md?raw';
import relatedCSS from './related-searches.css?raw';
import relatedJS from './related-searches.js?raw';
import topFilterCSS from './top-filter-options.css?raw';
import baseCSS from './starter/base.css?raw';
import searchControlsCSS from './search-controls.css?raw';
import resultTypographyCSS from './result-typography.css?raw';
import demoContentJS from './demo-content.js?raw';
import suggestionsCSS from './sample-suggestions.css?raw';
import suggestionsJS from './sample-suggestions.js?raw';
import resultTrackingJS from './result-tracking.js?raw';
import resultPagesJS from './result-pages.js?raw';
import cardMetadataJS from './card-metadata.ts?starter-js';
import resultSummaryJS from './result-summary.ts?starter-js';
import paginationFocusJS from './pagination-focus.js?raw';
import contentLanguageJS from './content-language.js?raw';
import webURLJS from './web-url.js?raw';
import customerAnswersJS from './customer-answers.js?raw';
import starterServicesJS from './starter-services.js?raw';
import type { Entitlements, Profile } from './app-configuration';
import starterAnswersJS from './starter-answers.js?raw';
import thumbnailAltJS from './thumbnail-alt.js?raw';
import promotionsCSS from './sample-promotions.css?raw';
import publishedFacets from './published-facets.ts?starter-js';
import facetLimits from './facet-limits.ts?starter-js';
import facetGroups from './facet-groups.ts?starter-js';
import promotionDisplay from './promotion-display.ts?starter-js';
import promotionsJS from './sample-promotions.js?raw';
import smartAnswersSampleHTML from './smart-answers-sample.html?raw';
import smartAnswersSampleCSS from './smart-answers-sample.css?raw';
import customerSuggestions from './customer-suggestions.js?raw';
import recordedSearchJS from './recorded-search.js?raw';
import recordedResponseJS from './recorded-response.js?raw';
import recordedSearchesJSON from './recorded-searches.json?raw';
import reactHTML from './starter-react/index.html?raw';
import reactPackage from './starter-react/package.json?raw';
import reactLock from './starter-react/package-lock.json?raw';
import reactEntry from './starter-react/main.jsx?raw';
import reactApp from './starter-react/SearchApp.jsx?raw';
import reactReadme from './starter-react/README.md?raw';
import vueHTML from './starter-vue/index.html?raw';
import vuePackage from './starter-vue/package.json?raw';
import vueLock from './starter-vue/package-lock.json?raw';
import vueViteConfig from './starter-vue/vite.config.js?raw';
import vueEntry from './starter-vue/main.js?raw';
import vueApp from './starter-vue/SearchApp.vue?raw';
import vueReadme from './starter-vue/README.md?raw';
import angularHTML from './starter-angular/index.html?raw';
import angularPackage from './starter-angular/package.json?raw';
import angularLock from './starter-angular/package-lock.json?raw';
import angularConfig from './starter-angular/angular.json?raw';
import angularTsConfig from './starter-angular/tsconfig.json?raw';
import angularEntry from './starter-angular/main.ts.txt?raw';
import angularApp from './starter-angular/search-app.ts.txt?raw';
import angularTemplate from './starter-angular/search-app.html?raw';
import angularReadme from './starter-angular/README.md?raw';

import profileFeaturesJS from './profile-features.js?raw';
import designRuntime from './design.ts?starter-js';
import sortRuntime from './demo-sorting.ts?starter-js';
import recoveryRuntime from './search-recovery.ts?starter-js';
import starterPassages from './starter-passages.js?raw';
import cardRuntime from './result-card.ts?starter-js';
import appConfigurationRuntime from './app-configuration.ts?starter-js';
import profileRuntime from './profile-experiences.ts?starter-js';
import searchRuntime from './customer-search.ts?starter-js';
import locationRuntime from './location-search.ts?starter-js';
import spellingRuntime from './spelling.ts?starter-js';
import groupingRuntime from './grouped-results.ts?starter-js';
import type { ExperienceHandoff } from './profile-experiences';
import profileControls from './profile-controls.html?raw';
import profileCSS from './profile-controls.css?raw';
import profileMount from './starter-profile/mount.js?raw';
import profileHTML from './starter-profile/index.html?raw';
import profileReact from './starter-profile/SearchApp.jsx?raw';
import profileVue from './starter-profile/SearchApp.vue?raw';
import profileAngular from './starter-profile/search-app.ts.txt?raw';

type StarterConnection = {
  experience?: ExperienceHandoff;
  customer: boolean;
  demoModel: string;
  language: string;
  featureSettings: {
    endpointHash?: string;
    entitlements: Entitlements;
    relatedSearchesByLanguage: Record<string, boolean | undefined>;
    profiles: Partial<Profile>[];
  };
  model: string;
  kitURL: string;
};

const locationHandoff = `## Manual location search

For a location-enabled Search Profile, configure \`window.SearchLabLocationGeocoder\` on the page. The function receives the typed place and returns an object with \`address\`, \`lat\`, and \`lon\`, or \`null\` when it can’t resolve the place. Keep provider credentials on your server.

The **Offer current location** setting exports an optional **Use my location** button. The browser asks for permission when a visitor activates it. A secure context is required.

The starter uses the radius choices and units published by the profile. Clearing a place restores the full results. Place text and coordinates aren’t stored in the starter’s settings.`;

function escapeHTML(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

export function renderStarterCSS(design: DesignSettings): string {
  const variables = Object.entries(designVariables(design)).map(([name, value]) => `  ${name}: ${value};`).join('\n');
  let css = `${resultTypographyCSS.trimEnd()}

${baseCSS.trimEnd()}

${searchControlsCSS.trimEnd()}

${topFilterCSS.trimEnd()}

${relatedCSS.trimEnd()}

${suggestionsCSS.trimEnd()}

${promotionsCSS.trimEnd()}

${smartAnswersSampleCSS.trimEnd()}

/* Your design settings */
.search-starter {
${variables}
  font-family: var(--search-font);
  background: var(--search-background);
  color: var(--search-ink);
}

.search-starter :is(.search-starter__form input, .search-starter__submit, .search-starter__sort select, .search-starter__result-thumbnail, .search-starter__pagination button) {
  border-radius: var(--search-corners);
}

.search-starter__submit {
  color: var(--search-accent-text);
  background: var(--search-accent);
}

.search-starter__filters input {
  accent-color: var(--search-accent);
}

.search-starter .searchstax-search-results {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--search-result-gap);
}

.search-starter .searchstax-search-result {
  border-left: 3px solid var(--search-accent);
  border-radius: var(--search-corners);
  border-block-end-color: var(--search-divider);
}

.search-starter .searchstax-search-result h2 a {
  color: var(--search-title-ink);
  text-decoration: ${design.underlineTitles ? 'underline' : 'none'};
}

.search-starter .searchstax-search-result h2 a:hover {
  text-decoration: underline;
}

.search-starter :is(.smart-answers-sample__card a, .smart-answers-sample__note, .sample-indexed-promotion, .searchstax-search-result .search-promotion-marker) {
  color: inherit;
}
`;

  if (design.profileTabs || design.languagePicker) css += '\n' + profileCSS;

  if (design.layout === 'cards') {
    css += `
@media (min-width: 1050px) {
  .search-starter .searchstax-search-results {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
`;
  } else {
    css += `
.search-starter .searchstax-search-result {
  padding: 10px 0;
  border-block-start: 0;
  border-inline: 0;
  border-radius: 0;
  ${design.listDividers ? '' : 'border-block-end-color: transparent;'}
}
`;
  }

  if (!design.showDescriptions) {
    css += `
.search-starter .search-starter__result-description {
  display: none;
}
`;
  }

  if (!design.filters) {
    return css + `
.search-starter .search-starter__filters {
  display: none;
}
`;
  }

  if (design.filterPlacement === 'top') return css;

  return css + `
@media (min-width: 561px) {
  .search-starter__body {
    grid-template-columns: 145px minmax(0, 1fr);
  }
}
`;
}

function starterFeatures(design: DesignSettings) {
  return {
    cardMetadata: design.cardMetadata,
    resultLinkTarget: design.resultLinkTarget,
    relatedPlacement: design.relatedPlacement,
    relatedHeading: design.relatedHeading,
    relatedItemStyle: design.relatedItemStyle,
    relatedSpacing: design.relatedSpacing,
    showFilters: design.filters,
    facetMode: design.facetMode,
    facetDesktop: design.facetDesktop,
    facetMobile: design.facetMobile,
    facetGroups: design.facetGroups,
    showSorting: design.showSorting,
    sortLabel: design.sortLabel,
    summaryMode: design.summaryMode,
    summaryPlacement: design.summaryPlacement,
    autoCorrect: design.autoCorrect,
    sortPlacement: design.sortPlacement,
    startingSort: design.startingSort,
    showSuggestions: design.showSuggestions,
    suggestionMinChars: design.suggestionMinChars,
    suggestionRowSpacing: design.suggestionRowSpacing,
    emphasizeSuggestionText: design.emphasizeSuggestionText,
    locationDefaultRadius: design.locationDefaultRadius,
    showCurrentLocation: design.showCurrentLocation,
    smartAnswerHeading: design.smartAnswerHeading,
    smartAnswerCardStyle: design.smartAnswerCardStyle,
    smartAnswerSourceStyle: design.smartAnswerSourceStyle,
    smartAnswerWordLimit: design.smartAnswerWordLimit,
    promotionBadge: design.promotionBadge,
    promotionHeading: design.promotionHeading,
    bannerPlacement: design.bannerPlacement,
    paginationMode: design.groupedBy ? 'paged' : design.paginationMode,
    paginationPlacement: design.paginationPlacement,
    loadMoreText: design.loadMoreText,
    resultsPerPage: design.resultsPerPage,
    groupedBy: design.groupedBy,
    itemsPerGroup: design.itemsPerGroup,
    noResultsText: design.noResultsText,
  };
}

function collectThumbnails(enabled: boolean) {
  const paths: Record<string, string> = {};
  const files: Record<string, Uint8Array> = {};
  if (enabled) {
    for (const [url, thumbnail] of Object.entries(demoThumbnails)) {
      paths[url] = thumbnail.path;
      const base64 = thumbnail.source.slice(thumbnail.source.indexOf(',') + 1);
      files[thumbnail.path] = Uint8Array.from(atob(base64), char => char.charCodeAt(0));
    }
  }
  return { paths, files };
}

type Framework = 'javascript' | 'react' | 'vue' | 'angular';

function recordedInitialQuery(experience: ExperienceHandoff): string {
  try {
    const catalog = JSON.parse(recordedSearchesJSON) as Record<string, Record<string, unknown>>;
    const entries = catalog[experience.selected.profile] ?? {};
    const preferred = experience.initialQuery.trim().toLowerCase();
    if (preferred && entries[preferred]) return preferred;
    if (entries.rehabilitation) return 'rehabilitation';
    return Object.keys(entries)[0] || 'rehabilitation';
  } catch {
    return 'rehabilitation';
  }
}

function createProfileStarter(framework: Framework, design: DesignSettings, experience: ExperienceHandoff, recordedDemo = false) {
  const profileExperience = recordedDemo
    ? { ...experience, initialQuery: recordedInitialQuery(experience) }
    : experience;
  const profileConnection = recordedDemo
    ? { endpoint: './__search-lab-recorded-search', token: 'recorded-search' }
    : { endpoint: '', token: '' };
  const entries: Record<string, string> = {
    'search.css': renderStarterCSS(design),
    'src/facet-limits.js': facetLimits,
    'src/facet-groups.js': facetGroups,
    'src/published-facets.js': publishedFacets,
    'src/profile-experiences.js': profileRuntime,
    'src/result-summary.js': resultSummaryJS,
    'src/pagination-focus.js': paginationFocusJS,
    'src/app-configuration.js': appConfigurationRuntime,
    'src/card-metadata.js': cardMetadataJS,
    'src/result-card.js': cardRuntime,
    'src/thumbnail-alt.js': thumbnailAltJS,
    'src/search-recovery.js': recoveryRuntime,
    'src/profile-features.js': profileFeaturesJS,
    'src/design.js': designRuntime,
    'src/demo-sorting.js': sortRuntime,
    'src/customer-suggestions.js': customerSuggestions,
    'src/customer-answers.js': customerAnswersJS,
    'src/sample-suggestions.js': suggestionsJS,
    'src/promotion-display.js': promotionDisplay,
    'src/sample-promotions.js': promotionsJS,
    'src/related-searches.js': relatedJS,
    'src/customer-search.js': searchRuntime,
    'src/spelling.js': spellingRuntime,
    'src/location-search.js': locationRuntime,
    'src/grouped-results.js': groupingRuntime,
    'src/content-language.js': contentLanguageJS,
    'src/web-url.js': webURLJS,
    'src/config.js': `export const settings = ${JSON.stringify({ ...profileExperience, navigation: design, logoURL: design.logoURL,
      thumbnails: profileExperience.source === 'demo' || (recordedDemo && design.showThumbnails) ? Object.fromEntries(Object.entries(demoThumbnails).map(([url, image]) => [url, image.source])) : {} }, null, 2)};

// Use your app’s HTTPS Select endpoint and a browser-safe read-only token.
export const connection = ${JSON.stringify(profileConnection)};
`,
    'src/mount.js': profileMount.replace('%%EXPERIENCE_HTML%%', () => JSON.stringify(profileControls.replace('<!-- smart-answer-sample -->', () => smartAnswersSampleHTML))),
    'src/recorded-search.js': recordedSearchJS,
    'src/recorded-response.js': recordedResponseJS,
    'src/recorded-searches.js': `export default ${recordedDemo ? (recordedSearchesJSON.trim() || '{}') : '{}'};\n`,
  };
  switch (framework) {
    case 'javascript':
      Object.assign(entries, { 'index.html': profileHTML, 'src/main.js': "import { mountProfileSearch } from './mount.js';\nmountProfileSearch(document.getElementById('app'));\n" });
      break;
    case 'react':
      Object.assign(entries, { 'index.html': reactHTML, 'package.json': reactPackage, 'package-lock.json': reactLock,
        'src/main.jsx': reactEntry, 'src/SearchApp.jsx': profileReact });
      break;
    case 'vue':
      Object.assign(entries, { 'index.html': vueHTML, 'package.json': vuePackage, 'package-lock.json': vueLock,
        'src/main.js': vueEntry, 'src/SearchApp.vue': profileVue, 'vite.config.js': vueViteConfig });
      break;
    case 'angular':
      Object.assign(entries, { 'src/index.html': angularHTML, 'package.json': angularPackage, 'package-lock.json': angularLock,
        'src/main.ts': angularEntry, 'src/search-app.ts': profileAngular, 'angular.json': angularConfig,
        'tsconfig.json': angularTsConfig, 'public/.gitkeep': '' });
      break;
  }
  const run = framework === 'javascript'
    ? 'From the extracted folder, run `python3 -m http.server 8000` and open http://localhost:8000/.'
    : 'From the extracted folder, run `npm ci`, then `npm run dev` and open the local address printed in the terminal. Run `npm run build` for a production build.';
  entries['README.md'] = `# Search by language and profile

## Run the starter

${run}

## Try the design

${recordedDemo ? `Search for **${profileExperience.initialQuery}** in the saved **${profileExperience.selected.profile}** example and open a result. The preview settings determine which profile opens first and whether visitors can switch profiles or languages.` : experience.source === 'demo' ? 'Search for **campus** in the sample directory and open a result. The preview settings determine whether visitors can switch profiles, choose English or Spanish, and filter results.' : 'Your selected languages, profiles, feature settings, and starting tab are in **src/config.js**. Add the connection settings below and enter a search term from your site.'}

When both controls are enabled, the language picker controls which profiles appear. Switching profiles keeps the submitted query and returns to the first page. Use the arrow keys to move between tabs.

## Connect your Search App

In **src/config.js**, set **settings.source** to **app**. Enter the HTTPS Select endpoint from App Settings → All APIs → Search & Indexing in **connection.endpoint**, and its browser-safe read-only token in **connection.token**. These values are visible to visitors. Use **settings.profiles** for the list of language and profile pairs and **settings.selected** for the starting pair. Empty language and profile values use the app defaults. Set **settings.initialQuery** to your preferred opening query or leave it blank.

To use optional services in your own app, add the HTTPS Auto-Suggest endpoint as **connection.suggestEndpoint**, the streaming Answer endpoint as **connection.answerEndpoint**, or the Related Searches endpoint and Discovery key as **connection.relatedURL** and **connection.discoveryKey**. Use credentials intended for browser use. Set **settings.entitlements** from the app’s entitlements. For each entry in **settings.profiles**, use the published **relatedSearches** setting for its language and the **smartAnswers** setting for its profile. Each service requires its entitlement and published setting. Related Searches requests use the search phrase and language. Smart Answers requests also use the selected profile.

${locationHandoff}

Set **settings.navigation.suggestionMinChars** to **null** to use the suggestion source’s minimum, or enter a higher number to delay suggestions.

Mapped thumbnails use empty alt text by default. If the image adds information, return its description as a Results Field. Set **connection.thumbnailAltField** to its field name in **src/config.js** and **connection.thumbnailsWithoutAltAreDecorative** to **false** to omit images without descriptions.

Live results use the Search API. Tracking is off in this starter.
`;
  const archive = zipSync(Object.fromEntries(Object.entries(entries).map(([name, content]) => [name, strToU8(content)])));
  return new Blob([new Uint8Array(archive)], { type: 'application/zip' });
}

function ordinaryConnection(connection: StarterConnection) {
  const source = connection.customer ? 'app' : 'demo';
  return {
    // Demo downloads use recorded responses and never spend Search App
    // requests. Connected downloads start blank so the developer supplies
    // their own endpoint and browser-safe token.
    source,
    searchURL: connection.customer ? '' : './__search-lab-recorded-search',
    searchAuth: connection.customer ? '' : 'recorded-search',
    model: connection.model,
    language: connection.language,
    questionURL: '',
    relatedURL: '',
    discoveryKey: '',
    suggesterURL: '',
    analyticsBaseUrl: '',
    trackApiKey: '',
  };
}

function ordinaryServiceFiles(connection: StarterConnection, prefix: string) {
  const settings = 'export const featureSettings = ' + JSON.stringify(connection.featureSettings, null, 2) + ';\n';
  return {
    [prefix + 'feature-settings.js']: strToU8(settings),
    [prefix + 'app-configuration.js']: strToU8(appConfigurationRuntime),
    [prefix + 'starter-services.js']: strToU8(starterServicesJS),
    [prefix + 'starter-answers.js']: strToU8(starterAnswersJS),
  };
}

export function createStarterZip(
  design: DesignSettings,
  connection: StarterConnection,
  demoFacetLabels: Record<string, string>,
): Blob {
  if (connection.experience) return createProfileStarter('javascript', design, connection.experience, !connection.customer && connection.experience.source === 'app');
  const config = JSON.stringify({
    ...ordinaryConnection(connection), thumbnailAltField: '', thumbnailsWithoutAltAreDecorative: true,
    ...starterFeatures(design),
  }, null, 2);
  const htmlValues = {
    UI_KIT_URL: connection.kitURL,
    HEADING: connection.customer ? 'Search' : 'Search Central County',
    INITIAL_QUERY: connection.customer ? '' : 'rehabilitation',
    SEARCH_FIELD_TEXT: design.searchFieldText,
    SEARCH_BUTTON_TEXT: design.searchButtonText,
  };
  const html = htmlTemplate.replace(
    /%%(UI_KIT_URL|SEARCH_FIELD_TEXT|SEARCH_BUTTON_TEXT|HEADING|INITIAL_QUERY|COMPANY_LOGO)%%/g,
    (_, key: keyof typeof htmlValues | 'COMPANY_LOGO') => {
      if (key === 'COMPANY_LOGO') {
        return design.logoURL
          ? `<img class="search-starter__logo" src="${escapeHTML(design.logoURL)}" alt="Company logo" referrerpolicy="no-referrer">`
          : '';
      }
      return escapeHTML(htmlValues[key]);
    },
  );
  const demoFacets = JSON.stringify({ searchURL: './__search-lab-recorded-search', model: connection.demoModel, labels: demoFacetLabels }, null, 2);
  const { paths: thumbnailPaths, files: thumbnailFiles } = collectThumbnails(design.showThumbnails);
  const javascript = jsTemplate
    .replace('%%STARTER_CONFIG%%', () => config)
    .replace('%%DEMO_FACETS%%', () => demoFacets)
    .replace('%%DEMO_THUMBNAILS%%', () => JSON.stringify(thumbnailPaths, null, 2));
  const archive = zipSync({
    ...ordinaryServiceFiles(connection, ''),
    'index.html': strToU8(html),
    'search.css': strToU8(renderStarterCSS(design)),
    'facet-limits.js': strToU8(facetLimits),
    'facet-groups.js': strToU8(facetGroups),
    'search.js': strToU8(javascript),
    'recorded-search.js': strToU8(recordedSearchJS),
    'recorded-response.js': strToU8(recordedResponseJS),
    'recorded-searches.js': strToU8(`export default ${recordedSearchesJSON.trim() || '{}'};\n`),
    'sorting.js': strToU8(starterSorting),
    'demo-content.js': strToU8(demoContentJS),
    'content-language.js': strToU8(contentLanguageJS),
    'web-url.js': strToU8(webURLJS),
    'card-metadata.js': strToU8(cardMetadataJS),
    'result-card.js': strToU8(cardRuntime),
    'starter-passages.js': strToU8(starterPassages),
    'thumbnail-alt.js': strToU8(thumbnailAltJS),
    'customer-answers.js': strToU8(customerAnswersJS),
    'customer-suggestions.js': strToU8(customerSuggestions),
    'suggestions.js': strToU8(suggestionsJS),
    'result-tracking.js': strToU8(resultTrackingJS),
    'related-searches.js': strToU8(relatedJS),
    'pagination-focus.js': strToU8(paginationFocusJS),
    'result-pages.js': strToU8(resultPagesJS),
    'result-summary.js': strToU8(resultSummaryJS),
    'promotion-display.js': strToU8(promotionDisplay),
    'spelling.js': strToU8(spellingRuntime),
    'location-search.js': strToU8(locationRuntime),
    'grouped-results.js': strToU8(groupingRuntime),
    'README.md': strToU8(readme.trimEnd() + '\n\n' + locationHandoff + '\n'),
    ...thumbnailFiles,
  });

  return new Blob([new Uint8Array(archive)], { type: 'application/zip' });
}

function frameworkStarterFiles(
  design: DesignSettings,
  selected: StarterConnection,
  facetLabels: Record<string, string>,
) {
  const { paths, files } = collectThumbnails(design.showThumbnails);
  const demo = {
    searchURL: './__search-lab-recorded-search', model: selected.demoModel,
    language: 'en',
    facetLabels,
    thumbnailPaths: Object.fromEntries(Object.entries(paths).map(([url, path]) => [url, '/' + path])),
  };
  const settings = {
    ...starterFeatures(design),
    showThumbnails: design.showThumbnails,
    searchFieldText: design.searchFieldText,
    searchButtonText: design.searchButtonText,
    logoURL: design.logoURL,
  };
  const config = `// Public Central County demo. Keep this constant when connecting your own app.
export const demo = ${JSON.stringify(demo, null, 2)};

// Replace these values with your app’s browser-safe settings.
export const connection = ${JSON.stringify({
  ...ordinaryConnection(selected), initialQuery: '', thumbnailAltField: '', thumbnailsWithoutAltAreDecorative: true,
}, null, 2)};

export const design = ${JSON.stringify(settings, null, 2)};
`;
  return {
    'search.css': strToU8(renderStarterCSS(design)),
    'src/config.js': strToU8(config),
    'src/recorded-search.js': strToU8(recordedSearchJS),
    'src/recorded-response.js': strToU8(recordedResponseJS),
    'src/recorded-searches.js': strToU8(`export default ${recordedSearchesJSON.trim() || '{}'};\n`),
    'src/sorting.js': strToU8(starterSorting),
    'src/demo-content.js': strToU8(demoContentJS),
    'src/suggestions.js': strToU8(suggestionsJS),
    'src/result-tracking.js': strToU8(resultTrackingJS),
    'src/related-searches.js': strToU8(relatedJS),
    'src/pagination-focus.js': strToU8(paginationFocusJS),
    'src/result-pages.js': strToU8(resultPagesJS),
    'src/result-summary.js': strToU8(resultSummaryJS),
    'src/content-language.js': strToU8(contentLanguageJS),
    'src/web-url.js': strToU8(webURLJS),
    'src/facet-limits.js': strToU8(facetLimits),
    'src/facet-groups.js': strToU8(facetGroups),
    'src/card-metadata.js': strToU8(cardMetadataJS),
    'src/result-card.js': strToU8(cardRuntime),
    'src/starter-passages.js': strToU8(starterPassages),
    'src/customer-answers.js': strToU8(customerAnswersJS),
    'src/spelling.js': strToU8(spellingRuntime),
    'src/location-search.js': strToU8(locationRuntime),
    'src/grouped-results.js': strToU8(groupingRuntime),
    ...ordinaryServiceFiles(selected, 'src/'),
    'src/thumbnail-alt.js': strToU8(thumbnailAltJS),
    'src/customer-suggestions.js': strToU8(customerSuggestions),
    ...Object.fromEntries(Object.entries(files).map(([path, bytes]) => ['public/' + path, bytes])),
  };
}

export function createReactStarterZip(
  design: DesignSettings,
  connection: StarterConnection,
  facetLabels: Record<string, string>,
): Blob {
  if (connection.experience) return createProfileStarter('react', design, connection.experience, !connection.customer && connection.experience.source === 'app');
  const archive = zipSync({
    'index.html': strToU8(reactHTML),
    'package.json': strToU8(reactPackage),
    'package-lock.json': strToU8(reactLock),
    'README.md': strToU8(reactReadme.trimEnd() + '\n\n' + locationHandoff + '\n'),
    'src/main.jsx': strToU8(reactEntry),
    'src/SearchApp.jsx': strToU8(reactApp),
    ...frameworkStarterFiles(design, connection, facetLabels),
  });
  return new Blob([new Uint8Array(archive)], { type: 'application/zip' });
}

export function createVueStarterZip(
  design: DesignSettings,
  connection: StarterConnection,
  facetLabels: Record<string, string>,
): Blob {
  if (connection.experience) return createProfileStarter('vue', design, connection.experience, !connection.customer && connection.experience.source === 'app');
  const archive = zipSync({
    'index.html': strToU8(vueHTML),
    'package.json': strToU8(vuePackage),
    'package-lock.json': strToU8(vueLock),
    'README.md': strToU8(vueReadme.trimEnd() + '\n\n' + locationHandoff + '\n'),
    'vite.config.js': strToU8(vueViteConfig),
    'src/main.js': strToU8(vueEntry),
    'src/SearchApp.vue': strToU8(vueApp),
    ...frameworkStarterFiles(design, connection, facetLabels),
  });
  return new Blob([new Uint8Array(archive)], { type: 'application/zip' });
}

export function createAngularStarterZip(
  design: DesignSettings,
  connection: StarterConnection,
  facetLabels: Record<string, string>,
): Blob {
  if (connection.experience) return createProfileStarter('angular', design, connection.experience, !connection.customer && connection.experience.source === 'app');
  const archive = zipSync({
    'package.json': strToU8(angularPackage),
    'package-lock.json': strToU8(angularLock),
    'angular.json': strToU8(angularConfig),
    'tsconfig.json': strToU8(angularTsConfig),
    'README.md': strToU8(angularReadme.trimEnd() + '\n\n' + locationHandoff + '\n'),
    'src/index.html': strToU8(angularHTML),
    'src/main.ts': strToU8(angularEntry),
    'src/search-app.ts': strToU8(angularApp),
    'src/search-app.html': strToU8(angularTemplate),
    'public/.gitkeep': new Uint8Array(0),
    ...frameworkStarterFiles(design, connection, facetLabels),
  });
  return new Blob([new Uint8Array(archive)], { type: 'application/zip' });
}
