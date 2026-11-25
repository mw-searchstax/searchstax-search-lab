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
import promotionDisplay from './promotion-display.ts?starter-js';
import promotionsJS from './sample-promotions.js?raw';
import smartAnswersSampleHTML from './smart-answers-sample.html?raw';
import smartAnswersSampleCSS from './smart-answers-sample.css?raw';
import customerSuggestions from './customer-suggestions.js?raw';
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
    endpoint?: string;
    endpointHash?: string;
    entitlements: Entitlements;
    relatedSearchesByLanguage: Record<string, boolean | undefined>;
    profiles: Partial<Profile>[];
  };
  questionURL: string;
  relatedURL: string;
  discoveryKey: string;
  searchURL: string;
  searchAuth: string;
  model: string;
  kitURL: string;
};

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
    relatedPlacement: design.relatedPlacement,
    showFilters: design.filters,
    facetMode: design.facetMode,
    facetDesktop: design.facetDesktop,
    facetMobile: design.facetMobile,
    showSorting: design.showSorting,
    sortLabel: design.sortLabel,
    summaryMode: design.summaryMode,
    summaryPlacement: design.summaryPlacement,
    sortPlacement: design.sortPlacement,
    startingSort: design.startingSort,
    showSuggestions: design.showSuggestions,
    promotionBadge: design.promotionBadge,
    promotionHeading: design.promotionHeading,
    bannerPlacement: design.bannerPlacement,
    paginationMode: design.paginationMode,
    loadMoreText: design.loadMoreText,
    resultsPerPage: design.resultsPerPage,
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

function createProfileStarter(framework: Framework, design: DesignSettings, experience: ExperienceHandoff) {
  const entries: Record<string, string> = {
    'search.css': renderStarterCSS(design),
    'src/facet-limits.js': facetLimits,
    'src/published-facets.js': publishedFacets,
    'src/profile-experiences.js': profileRuntime,
    'src/result-summary.js': resultSummaryJS,
    'src/app-configuration.js': appConfigurationRuntime,
    'src/result-card.js': cardRuntime,
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
    'src/content-language.js': contentLanguageJS,
    'src/web-url.js': webURLJS,
    'src/config.js': `export const settings = ${JSON.stringify({ ...experience, navigation: design, logoURL: design.logoURL,
      thumbnails: experience.source === 'demo' ? Object.fromEntries(Object.entries(demoThumbnails).map(([url, image]) => [url, image.source])) : {} }, null, 2)};

// Use your app’s HTTPS Select endpoint and a browser-safe read-only token.
export const connection = { endpoint: '', token: '' };
`,
    'src/mount.js': profileMount.replace('%%EXPERIENCE_HTML%%', () => JSON.stringify(profileControls.replace('<!-- smart-answer-sample -->', () => smartAnswersSampleHTML))),
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

${experience.source === 'demo' ? 'Search for **campus** in the sample directory and open a result. The preview settings determine whether visitors can switch profiles, choose English or Spanish, and filter results.' : 'Your selected languages, profiles, feature settings, and starting tab are in **src/config.js**. Add the connection settings below and enter a search term from your site.'}

When both controls are enabled, the language picker controls which profiles appear. Switching profiles keeps the submitted query and returns to the first page. Use the arrow keys to move between tabs.

## Connect your Search App

In **src/config.js**, set **settings.source** to **app**. Enter the HTTPS Select endpoint from App Settings → All APIs → Search & Indexing in **connection.endpoint**, and its browser-safe read-only token in **connection.token**. These values are visible to visitors. Use **settings.profiles** for the list of language and profile pairs and **settings.selected** for the starting pair. Empty language and profile values use the app defaults. Set **settings.initialQuery** to your preferred opening query or leave it blank.

To use optional services in your own app, add the HTTPS Auto-Suggest endpoint as **connection.suggestEndpoint**, the streaming Answer endpoint as **connection.answerEndpoint**, or the Related Searches endpoint and Discovery key as **connection.relatedURL** and **connection.discoveryKey**. Use credentials intended for browser use. Set **settings.entitlements** from the app’s entitlements. For each entry in **settings.profiles**, use the published **relatedSearches** setting for its language and the **smartAnswers** setting for its profile. Each service requires its entitlement and published setting. Related Searches requests use the search phrase and language. Smart Answers requests also use the selected profile.

Live results use the Search API. Tracking is off in this starter.
`;
  const archive = zipSync(Object.fromEntries(Object.entries(entries).map(([name, content]) => [name, strToU8(content)])));
  return new Blob([new Uint8Array(archive)], { type: 'application/zip' });
}

function ordinaryConnection(connection: StarterConnection) {
  return {
    searchURL: connection.customer ? '' : connection.searchURL,
    searchAuth: connection.customer ? '' : connection.searchAuth,
    model: connection.model,
    language: connection.language,
    questionURL: connection.questionURL,
    relatedURL: connection.relatedURL,
    discoveryKey: connection.discoveryKey,
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
  if (connection.experience) return createProfileStarter('javascript', design, connection.experience);
  const config = JSON.stringify({
    ...ordinaryConnection(connection),
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
  const demoFacets = JSON.stringify({ searchURL: connection.searchURL, model: connection.demoModel, labels: demoFacetLabels }, null, 2);
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
    'search.js': strToU8(javascript),
    'sorting.js': strToU8(starterSorting),
    'demo-content.js': strToU8(demoContentJS),
    'content-language.js': strToU8(contentLanguageJS),
    'web-url.js': strToU8(webURLJS),
    'result-card.js': strToU8(cardRuntime),
    'starter-passages.js': strToU8(starterPassages),
    'customer-answers.js': strToU8(customerAnswersJS),
    'customer-suggestions.js': strToU8(customerSuggestions),
    'suggestions.js': strToU8(suggestionsJS),
    'result-tracking.js': strToU8(resultTrackingJS),
    'related-searches.js': strToU8(relatedJS),
    'pagination-focus.js': strToU8(paginationFocusJS),
    'result-pages.js': strToU8(resultPagesJS),
    'result-summary.js': strToU8(resultSummaryJS),
    'promotion-display.js': strToU8(promotionDisplay),
    'README.md': strToU8(readme),
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
    searchURL: selected.searchURL, model: selected.demoModel,
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
  ...ordinaryConnection(selected), initialQuery: '', thumbnailAltField: '', thumbnailsWithoutAltAreDecorative: false,
}, null, 2)};

export const design = ${JSON.stringify(settings, null, 2)};
`;
  return {
    'search.css': strToU8(renderStarterCSS(design)),
    'src/config.js': strToU8(config),
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
    'src/result-card.js': strToU8(cardRuntime),
    'src/starter-passages.js': strToU8(starterPassages),
    'src/customer-answers.js': strToU8(customerAnswersJS),
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
  if (connection.experience) return createProfileStarter('react', design, connection.experience);
  const archive = zipSync({
    'index.html': strToU8(reactHTML),
    'package.json': strToU8(reactPackage),
    'package-lock.json': strToU8(reactLock),
    'README.md': strToU8(reactReadme),
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
  if (connection.experience) return createProfileStarter('vue', design, connection.experience);
  const archive = zipSync({
    'index.html': strToU8(vueHTML),
    'package.json': strToU8(vuePackage),
    'package-lock.json': strToU8(vueLock),
    'README.md': strToU8(vueReadme),
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
  if (connection.experience) return createProfileStarter('angular', design, connection.experience);
  const archive = zipSync({
    'package.json': strToU8(angularPackage),
    'package-lock.json': strToU8(angularLock),
    'angular.json': strToU8(angularConfig),
    'tsconfig.json': strToU8(angularTsConfig),
    'README.md': strToU8(angularReadme),
    'src/index.html': strToU8(angularHTML),
    'src/main.ts': strToU8(angularEntry),
    'src/search-app.ts': strToU8(angularApp),
    'src/search-app.html': strToU8(angularTemplate),
    'public/.gitkeep': new Uint8Array(0),
    ...frameworkStarterFiles(design, connection, facetLabels),
  });
  return new Blob([new Uint8Array(archive)], { type: 'application/zip' });
}
