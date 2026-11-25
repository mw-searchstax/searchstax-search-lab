import { sampleSuggestionSource, setupSearchSuggestions } from './suggestions.js';
import { createCustomerSuggestionSource } from './customer-suggestions.js';
import { getAnalyticsSettings, setupResultTracking } from './result-tracking.js';
import { setupStarterServices } from './starter-services.js';
import { setupPaginationFocus } from './pagination-focus.js';
import { contentLanguageTag } from './content-language.js';
import { starterPassages } from './starter-passages.js';
import { readCustomerEndpoint } from './web-url.js';
import { setupFacetLimits } from './facet-limits.js';
import { promotionEntries, renderPromotionBanners, placePromotionBanners } from './promotion-display.js';
import { createResultPages } from './result-pages.js';

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
const demoSorting = %%DEMO_SORTING%%;
const language = config.language;
const resultLanguage = contentLanguageTag(language);
const loadMoreText = String(config.loadMoreText || 'Load more').replace(/[&<>"'{}]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '{': '&#123;', '}': '&#125;' }[character]));
const usesDemoProfile = config.searchURL === demoFacets.searchURL &&
  config.model === demoSorting.model && resultLanguage === 'en';

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


function showFeedback(message, action) {
  status.textContent = message;
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
      showFeedback(total === 1 ? '1 result' : total + ' results');
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
  if (source) setupSearchSuggestions(form, 'starter-search-suggestions')(source);
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
  const pager = document.querySelector('[data-pagination-focus]');
  pager.addEventListener('click', event => {
    if (event.target.closest('button[data-page-step], .searchstax-pagination-load-more')) pager.after(feedback);
  }, true);
  setupPaginationFocus(pager, () => search);
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
        const passages = starterPassages(response, usesDemoProfile);
        const results = items.filter(item => /^https?:\/\//i.test(item.url));
        renderPromotionBanners(externalPromotions, promotionEntries(response.externalLinks), config.promotionHeading, resultLanguage);
        const mapped = results.map(item => ({
          ...item, ...passages(item), resultLanguage, promotionBadge: config.promotionBadge,
          demoThumbnail: usesDemoProfile ? demoThumbnails[item.url] : '',
        }));
        return config.paginationMode === 'loadMore'
          ? resultPages.collect(response.response.start ?? 0, mapped)
          : mapped;
      },
    },
  });
  enableResultRecovery(search);
  search.setCookiesDisabled(!analytics.trackApiKey);
  setupResultTracking(document.querySelector('#search-results'), search);

  if (config.showSorting) {
    const sortField = document.querySelector('#search-sorting');
    const sortOrder = document.querySelector('#search-sort-order');
    if (usesDemoProfile) {
      sortOrder.replaceChildren(...demoSorting.options.map(({ label, order }) => new Option(label, order)));
      sortField.hidden = false;
    } else {
      search.dataLayer.$searchResultsMetadata.subscribe(metadata => {
        const options = metadata?.sorting?.options ?? [];
        sortOrder.replaceChildren(...options.map(({ key, value }) => new Option(value || key, key)));
        const order = search.dataLayer.searchObject.order;
        sortOrder.value = options.find(({ key }) => encodeURIComponent(key) === order)?.key ?? '';
        sortField.hidden = options.length === 0;
      });
    }
    sortOrder.addEventListener('change', () => {
      const current = search.dataLayer.searchObject;
      if (current.query) {
        sortField.after(feedback);
        search.dataLayer.setSearchObject({ ...current, order: encodeURIComponent(sortOrder.value), page: 1 });
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
          {{#demoThumbnail}}<img class="search-starter__result-thumbnail" src="{{demoThumbnail}}" alt="" width="384" height="216" loading="lazy">{{/demoThumbnail}}
          {{#hasRibbon}}<span class="searchstax-search-result-ribbon">{{#ribbonParts}}${passageMarkup}{{/ribbonParts}}</span>{{/hasRibbon}}
          <h2{{#resultLanguage}} lang="{{resultLanguage}}"{{/resultLanguage}}><a href="{{url}}" data-result-id="{{uniqueId}}">{{#titleParts}}${passageMarkup}{{/titleParts}}</a></h2>
          <p class="search-starter__result-description"{{#resultLanguage}} lang="{{resultLanguage}}"{{/resultLanguage}}>{{#descriptionParts}}${passageMarkup}{{/descriptionParts}}</p>
          {{#otherFields}}<p>{{#label}}{{label}}: {{/label}}{{#parts}}${passageMarkup}{{/parts}}</p>{{/otherFields}}
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
