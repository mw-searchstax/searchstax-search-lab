import { sampleSuggestionSource, setupSearchSuggestions } from './suggestions.js';
import { createCustomerSuggestionSource } from './customer-suggestions.js';
import { getAnalyticsSettings, setupResultTracking } from './result-tracking.js';
import { setupStarterServices } from './starter-services.js';
import { setupPaginationPlacement } from './pagination-focus.js';
import { contentLanguageTag } from './content-language.js';
import { watchCardThumbnails } from './result-card.js';
import { starterResults } from './starter-passages.js';
import { readCustomerEndpoint } from './web-url.js';
import { setupFacetLimits } from './facet-limits.js';
import { selectedFacetGroups } from './facet-groups.js';
import { promotionEntries, renderPromotionBanners, placePromotionBanners } from './promotion-display.js';
import { createResultPages } from './result-pages.js';
import { formatResultSummary } from './result-summary.js';
import { decodedSort, encodedSort, createSortController, readResponseSortOptions, readSortOptions } from './sorting.js';
import { installRecordedSearch } from './recorded-search.js';
import recordings from './recorded-searches.js';

installRecordedSearch(recordings);

const logo = document.querySelector('.search-starter__logo');
if (logo) {
  logo.addEventListener('error', () => { logo.hidden = true; });
  if (logo.complete && !logo.naturalWidth) logo.hidden = true;
}

// UI Kit connection settings
// For a connected-app download, add your Select endpoint and read-only token here.
const config = %%STARTER_CONFIG%%;
const resultPages = createResultPages();

// Display labels for the demo facet values.
const demoFacets = %%DEMO_FACETS%%;
const demoThumbnails = %%DEMO_THUMBNAILS%%;
const language = config.language;
const resultLanguage = contentLanguageTag(language);
const loadMoreText = String(config.loadMoreText || 'Load more').replace(/[&<>"'{}]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '{': '&#123;', '}': '&#125;' }[character]));
const usesDemoProfile = config.source === 'demo' && config.model === demoFacets.model && resultLanguage === 'en';

const form = document.querySelector('.search-starter__form');
const submit = form.querySelector('button');
const query = document.querySelector('#search-query');
const status = document.querySelector('#search-status');
const feedback = document.querySelector('#search-feedback');
const retry = document.querySelector('#search-retry');
const reload = document.querySelector('#search-reload');
const output = document.querySelector('#search-output');
const externalPromotions = document.createElement('section');
externalPromotions.setAttribute('aria-label', 'External promotions');
externalPromotions.hidden = true;
placePromotionBanners(externalPromotions, output, config.bannerPlacement);
const noResultsMessage = document.querySelector('#search-no-results');
const sortField = document.querySelector('#search-sorting');
const sortOrder = document.querySelector('#search-sort-order');
const sortLabel = sortField?.querySelector('label');
let activeSearch;
let sortController;

function placeSortField() {
  if (!sortField) return;
  if (sortLabel?.firstChild) sortLabel.firstChild.nodeValue = String(config.sortLabel || 'Sort by') + ' ';
  sortField.dataset.sortPlacement = config.sortPlacement === 'below' ? 'below' : 'above';
  const output = document.querySelector('#search-output');
  if (config.sortPlacement === 'below') output?.after(sortField);
}

function applySortOptions(options) {
  if (!sortField || !sortOrder) return;
  sortOrder.replaceChildren(...options.map(({ label, order }) => new Option(label, order)));
  sortOrder.value = decodedSort(activeSearch?.dataLayer.searchObject.order || '');
  sortField.hidden = !config.showSorting || options.length === 0;
}


function showFeedback(message, action) {
  if (status.textContent !== message) status.textContent = message;
  if ((document.activeElement === retry || document.activeElement === reload) && document.activeElement !== action) {
    status.focus({ preventScroll: true });
  }
  retry.hidden = action !== retry;
  reload.hidden = action !== reload;
}

function withPreviousResults(message) {
  return document.querySelector('#search-results .searchstax-search-result a')
    ? message + ' Previous results are still showing.' : message;
}

function showResultSummary(total, start, visible) {
  const hadFocus = feedback.contains(document.activeElement);
  if (config.summaryPlacement === 'below') {
    if (output.nextElementSibling !== feedback) output.after(feedback);
  } else if (form.nextElementSibling !== feedback) form.after(feedback);
  showFeedback(formatResultSummary(config.summaryMode, { total, start, visible }));
  if (hadFocus) status.focus({ preventScroll: true });
}

reload.addEventListener('click', () => window.location.reload());

async function loadUiKit() {
  const script = document.createElement('script');
  script.src = document.querySelector('#search-starter-module').dataset.uiKit;
  const timer = window.setTimeout(() => showFeedback('Connecting to search is taking longer than usual.', reload), 15000);
  try {
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  } finally {
    window.clearTimeout(timer);
  }
}

// UI Kit 4.2.34 does not expose a failure hook for result requests. Keep this
// adapter on the starter's own instance so other searches on the page are unaffected.
function enableResultRecovery(search) {
  const helper = search.searchHelper;
  const kitSearch = helper.search.bind(helper);
  let active;
  helper.search = async (settings, render, ignoreCancellation, forceNotCorrected, facetType) => {
    if (facetType) return kitSearch(settings, render, ignoreCancellation, forceNotCorrected, facetType);
    if (!settings.query) return;
    active?.abort();
    const request = new AbortController();
    active = request;
    search.dataLayer.setSearchTerm(settings.query);
    search.dataLayer.setLoading(true);
    output.setAttribute('aria-busy', 'true');
    noResultsMessage.hidden = true;
    externalPromotions.hidden = true;
    showFeedback(withPreviousResults('Searching…'));
    const timer = window.setTimeout(() => {
      if (active === request) showFeedback(withPreviousResults('Search is taking longer than usual.'), retry);
    }, 15000);
    try {
      const url = helper.url + helper.generateQueryParams(settings, forceNotCorrected);
      const response = await fetch(url, { headers: helper.authHeader, signal: request.signal });
      if (!response.ok) throw new Error('Search returned HTTP ' + response.status);
      const data = await response.json();
      if (active !== request) return;
      if (typeof data.response?.numFound !== 'number' || !Array.isArray(data.response.docs)) {
        throw new Error('Incomplete search response');
      }
      render(data);
      const total = data.response.numFound;
      if (total === 0) showResultSummary(0, 0, 0);
      noResultsMessage.hidden = total !== 0;
    } catch {
      if (active === request) showFeedback(withPreviousResults('Search couldn’t load the requested results.'), retry);
    } finally {
      window.clearTimeout(timer);
      if (active === request) {
        active = undefined;
        output.setAttribute('aria-busy', 'false');
        search.dataLayer.setLoading(false);
      }
    }
  };
  retry.addEventListener('click', () => search.search(search.dataLayer.searchObject));
}

noResultsMessage.textContent = config.noResultsText;
form.addEventListener('submit', event => event.preventDefault());
if (config.showSuggestions) {
  let source = usesDemoProfile ? sampleSuggestionSource : null;
  if (!usesDemoProfile && config.suggesterURL) {
    const endpoint = readCustomerEndpoint(config.suggesterURL, 'emsuggest');
    if (endpoint) source = createCustomerSuggestionSource({ token: config.searchAuth, language }, endpoint);
  }
  if (source) setupSearchSuggestions(form, 'starter-search-suggestions')(source, config);
}

async function startSearch() {
  if (!config.searchURL || !config.searchAuth) {
    showFeedback('Set the Select endpoint and read-only token in search.js to start searching.');
    return;
  }
  await loadUiKit();
  const kit = window['@searchstaxInc/searchstudioUxJs'] || window.Searchstax;
  const Searchstax = typeof kit === 'function' ? kit : kit.Searchstax;
  const search = new Searchstax();
  activeSearch = search;
  sortController = createSortController({
    enabled: config.showSorting,
    requested: config.startingSort,
    getSearchObject: () => search.dataLayer.searchObject,
    setSearchObject: value => search.dataLayer.setSearchObject(value),
  });
  placeSortField();
  const abovePager = document.querySelector('[data-pager-position="above"]');
  const belowPager = document.querySelector('[data-pager-position="below"]');
  for (const pager of [abovePager, belowPager]) {
    pager.addEventListener('click', event => {
      if (event.target.closest('button[data-page-step], .searchstax-pagination-load-more')) pager.after(feedback);
    }, true);
  }
  setupPaginationPlacement(abovePager, belowPager, () => config, () => search);
  const analytics = getAnalyticsSettings(config);
  search.initialize({
    searchURL: config.searchURL,
    searchAuth: config.searchAuth,
    authType: 'token',
    language,
    model: config.model,
    suggesterURL: '',
    ...analytics,
    router: { enabled: false },
    hooks: {
      afterSearch(items, response) {
        const total = response?.response?.numFound;
        if (typeof total !== 'number') return [];
        renderPromotionBanners(externalPromotions, promotionEntries(response.externalLinks), config.promotionHeading, resultLanguage);
        const mapped = starterResults(items, response, usesDemoProfile ? demoThumbnails : null, config, config.cardMetadata)
          .map(item => ({ ...item, resultLanguage, promotionBadge: config.promotionBadge }));
        const options = readResponseSortOptions(response);
        applySortOptions(options);
        if (sortController?.handle(options)) return [];
        const start = response.response.start ?? 0;
        const loadMore = config.paginationMode === 'loadMore';
        const displayed = loadMore ? resultPages.collect(start, mapped) : mapped;
        showResultSummary(total, loadMore ? 0 : start, displayed.length);
        return displayed;
      },
    },
  });
  enableResultRecovery(search);
  search.setCookiesDisabled(!analytics.trackApiKey);
  watchCardThumbnails(document.querySelector('#search-results'));
  setupResultTracking(document.querySelector('#search-results'), search);

  if (config.showSorting) {
    search.dataLayer.$searchResultsMetadata.subscribe(metadata => applySortOptions(readSortOptions(metadata)));
    sortOrder.addEventListener('change', () => {
      const current = search.dataLayer.searchObject;
      if (current.query) {
        sortField.after(feedback);
        search.dataLayer.setSearchObject({ ...current, order: encodedSort(sortOrder.value), page: 1 });
      }
    });
  }

  const passageMarkup = '{{#matched}}<mark class="search-result-hit">{{text}}</mark>{{/matched}}{{^matched}}{{text}}{{/matched}}';
  search.addSearchResultsWidget('search-results', {
    renderMethod: 'pagination',
    resultsPerPage: config.resultsPerPage,
    templates: {
      mainTemplate: {
        template: '<div id="search-result-list" class="searchstax-search-results"></div>',
        searchResultsContainerId: 'search-result-list',
      },
      searchResultTemplate: {
        template: `<article class="searchstax-search-result">
          {{#promoted}}<span class="search-promotion-marker">{{promotionBadge}}</span>{{/promoted}}
          {{#previewThumbnail}}<img class="search-starter__result-thumbnail" src="{{previewThumbnail}}" alt="{{previewThumbnailAlt}}" loading="lazy" referrerpolicy="no-referrer">{{/previewThumbnail}}
          <div class="result-card-content">
            {{#hasRibbon}}<span class="searchstax-search-result-ribbon">{{#ribbonParts}}${passageMarkup}{{/ribbonParts}}</span>{{/hasRibbon}}
            {{#hasTitle}}<h2{{#resultLanguage}} lang="{{resultLanguage}}"{{/resultLanguage}}>{{#url}}<a href="{{url}}" data-result-id="{{uniqueId}}" referrerpolicy="no-referrer">{{#titleParts}}${passageMarkup}{{/titleParts}}</a>{{/url}}{{^url}}{{#titleParts}}${passageMarkup}{{/titleParts}}{{/url}}</h2>{{/hasTitle}}
            {{#hasDescription}}<p class="search-starter__result-description"{{#resultLanguage}} lang="{{resultLanguage}}"{{/resultLanguage}}>{{#descriptionParts}}${passageMarkup}{{/descriptionParts}}</p>{{/hasDescription}}
            {{#otherFields}}<p>{{#label}}{{label}}: {{/label}}{{#parts}}${passageMarkup}{{/parts}}</p>{{/otherFields}}
          </div>
        </article>`,
      },
      noSearchResultTemplate: { template: ' ' },
    },
  });
  // Keep the Results Widget in replacement mode so the accumulated projection
  // from afterSearch is rendered exactly once. The Pagination Widget still
  // uses its native infinite-scroll controls via this data-layer flag.
  search.dataLayer.setIsInfiniteScroll(config.paginationMode === 'loadMore');

  if (config.showFilters) {
    document.querySelector('.search-starter__filters').hidden = false;
    const facets = document.querySelector('#search-facets');
    setupFacetLimits(facets, () => config);
    facets.addEventListener('change', () => facets.after(feedback), true);
    if (usesDemoProfile) {
      new MutationObserver(() => {
        facets.querySelectorAll('[data-facet-value]').forEach(label => {
          const value = label.dataset.facetValue;
          const text = label.closest('fieldset')?.dataset.facet === 'demo_content_type_s' && Object.hasOwn(demoFacets.labels, value) ? demoFacets.labels[value] : value;
          if (label.textContent !== text) label.textContent = text;
        });
      }).observe(facets, { childList: true, subtree: true });
    }
    search.addFacetsWidget('search-facets', {
      facetingType: config.facetMode,
      specificFacets: selectedFacetGroups(config.facetGroups, config.model, config.language),
      itemsPerPageDesktop: Number.MAX_SAFE_INTEGER,
      itemsPerPageMobile: Number.MAX_SAFE_INTEGER,
      templates: {
        mainTemplateDesktop: { template: '<div class="search-facet-groups"></div>', facetsContainerClass: 'search-facet-groups' },
        mainTemplateMobile: { template: ' ' },
        facetItemContainerTemplate: {
          template: '<fieldset data-facet="{{name}}"><legend>{{label}}</legend><div class="search-facet-options search-facet-choices"></div></fieldset>',
          facetListContainerClass: 'search-facet-options',
        },
        facetItemTemplate: {
          template: '<label><input class="search-facet-checkbox" type="checkbox" {{#disabled}}disabled{{/disabled}} {{#isChecked}}checked{{/isChecked}}><span data-facet-value="{{value}}">{{value}}</span><small>{{count}}</small></label>',
          inputCheckboxClass: 'search-facet-checkbox',
          checkTriggerClasses: [],
        },
      },
    });
  }

  search.addPaginationWidget('search-pagination', {
    templates: {
      mainTemplate: {
        template: '{{#results.length}}<nav class="search-starter__pagination" aria-label="Search result pages"><span tabindex="-1" data-page-range data-page-start="{{startResultIndex}}">{{startResultIndex}}–{{endResultIndex}} of {{totalResults}} results</span>{{^isFirstPage}}<button type="button" data-page-step="previous">Previous</button>{{/isFirstPage}}{{^isLastPage}}<button type="button" data-page-step="next">Next</button>{{/isLastPage}}</nav>{{/results.length}}',
      },
      infiniteScrollTemplate: {
        // Use the existing paged-control event path for vanilla. The kit's
        // native Load More handler suppresses the click generated by Enter,
        // while data-page-step keeps keyboard and focus behavior consistent.
        template: `{{#results.length}}<nav class="search-starter__pagination" aria-label="Search result pages"><span tabindex="-1" data-page-range data-page-start="{{startResultIndex}}">{{endResultIndex}} of {{totalResults}} results{{#isLastPage}} — all results loaded{{/isLastPage}}</span>{{^isLastPage}}<button type="button" data-page-step="next" class="search-starter__load-more">${loadMoreText}</button>{{/isLastPage}}</nav>{{/results.length}}`,
      },
    },
  });
  search.dataLayer.setItemsPerPage(config.resultsPerPage);

  const services = setupStarterServices(form, document.querySelector('#search-answer'), config, config);
  function runSearch() {
    form.after(feedback);
    const term = query.value.trim();
    if (!term) {
      showFeedback('Enter a search term.');
      return;
    }
    void services.search(term);
    const current = search.dataLayer.searchObject;
    const next = { ...current, query: term, page: 1, facets: [] };
    if (term === current.query && current.page === 1 && !current.facets.length) {
      search.search(next);
    } else {
      search.dataLayer.setSearchObject(next);
    }
  }

  submit.disabled = false;
  form.addEventListener('submit', runSearch);
  if (query.value.trim()) runSearch();
  else showFeedback('Enter a search term.');
}

startSearch().catch(() => {
  submit.disabled = true;
  showFeedback('Search couldn’t start. Reload to try again.', reload);
});
