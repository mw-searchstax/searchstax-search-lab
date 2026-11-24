import { sampleSuggestionSource, setupSearchSuggestions } from './suggestions.js';
import { createCustomerSuggestionSource } from './customer-suggestions.js';
import { getAnalyticsSettings, setupResultTracking } from './result-tracking.js';
import { setupStarterRelated } from './related-searches.js';
import { setupPaginationFocus } from './pagination-focus.js';
import { contentLanguageTag } from './content-language.js';
import { demoResultText, demoResultTitle } from './demo-content.js';
import { readCustomerEndpoint, webURL } from './web-url.js';
import { readAnswerEndpoint, setupCustomerAnswers } from './customer-answers.js';
import {
  applySampleIndexedPromotion,
  createSampleExternalPromotion,
  samplePromotionMode,
  samplePromotionQuery,
  updateSampleExternalPromotion,
} from './promotions.js';

const logo = document.querySelector('.search-starter__logo');
if (logo) {
  logo.addEventListener('error', () => { logo.hidden = true; });
  if (logo.complete && !logo.naturalWidth) logo.hidden = true;
}

// UI Kit connection settings
// This starter connects to the public, read-only Central County demo.
// See README.md to connect your Search App.
const config = %%STARTER_CONFIG%%;

// Display labels for the demo facet values.
const demoFacets = %%DEMO_FACETS%%;
const demoThumbnails = %%DEMO_THUMBNAILS%%;
const demoSorting = %%DEMO_SORTING%%;
const language = config.language || 'en';
const resultLanguage = contentLanguageTag(language);
const usesDemoProfile = config.searchURL === demoFacets.searchURL &&
  config.model === demoSorting.model && resultLanguage === 'en';

const form = document.querySelector('.search-starter__form');
const submit = form.querySelector('button');
const query = document.querySelector('#search-query');
const status = document.querySelector('#search-status');
const output = document.querySelector('#search-output');
const smartAnswersSample = document.querySelector('#search-smart-answers-sample');
smartAnswersSample.hidden = !config.showSmartAnswersSample || !usesDemoProfile;

let requestAnswer;
if (!usesDemoProfile && config.showSmartAnswersSample && config.questionURL?.trim()) {
  const answerEndpoint = readAnswerEndpoint(config.questionURL);
  const profile = config.model?.trim();
  if (answerEndpoint && profile) {
    const answers = setupCustomerAnswers(document.querySelector('.search-starter'));
    const connection = { answerEndpoint, profile, language, token: config.searchAuth };
    requestAnswer = term => answers.start(connection, term);
  } else {
    document.querySelector('[data-customer-answer]').hidden = false;
    document.querySelector('[data-customer-answer-status]').textContent =
      'Set a Search Profile and a valid SearchStax streaming Answer endpoint to use Smart Answers.';
  }
}
const externalPromotions = usesDemoProfile ? createSampleExternalPromotion() : document.createElement('section');
if (!usesDemoProfile) externalPromotions.setAttribute('aria-label', 'External promotions');
externalPromotions.hidden = true;
output.before(externalPromotions);
if (usesDemoProfile && config.samplePromotions !== 'off') {
  query.value = samplePromotionQuery;
}
const noResultsMessage = document.querySelector('#search-no-results');
let requestTimer;
let promotionResponse;

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

function renderExternalPromotions(entries) {
  const banners = [];
  for (const entry of Array.isArray(entries) ? entries : []) {
    if (typeof entry?.url !== 'string') continue;
    const url = webURL(entry.url);
    if (!url) continue;

    const banner = document.createElement('div');
    banner.className = 'search-promotion-banner';
    const label = document.createElement('span');
    label.className = 'search-promotion-marker';
    label.textContent = 'Promoted';
    const link = document.createElement('a');
    link.href = url;
    link.referrerPolicy = 'no-referrer';
    link.textContent = (typeof entry.name === 'string' && entry.name.trim()) || url;
    if (resultLanguage) link.lang = resultLanguage;
    banner.append(label, link);
    if (typeof entry.description === 'string' && entry.description.trim()) {
      const description = document.createElement('p');
      description.textContent = entry.description.trim();
      if (resultLanguage) description.lang = resultLanguage;
      banner.append(description);
    }
    banners.push(banner);
  }
  externalPromotions.replaceChildren(...banners);
  externalPromotions.hidden = banners.length === 0;
}

try {
  const kit = window['@searchstaxInc/searchstudioUxJs'] || window.Searchstax;
  const Searchstax = typeof kit === 'function' ? kit : kit.Searchstax;
  const search = new Searchstax();
  setupPaginationFocus(document.querySelector('[data-pagination-focus]'), () => search);
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
        window.clearTimeout(requestTimer);
        status.textContent = total === 1 ? '1 result' : total + ' results';
        noResultsMessage.hidden = total !== 0;
        const results = items.filter(item => /^https?:\/\//i.test(item.url));
        if (!usesDemoProfile) {
          if (response !== promotionResponse) {
            promotionResponse = response;
            renderExternalPromotions(response.externalLinks);
          }
          return results.map(item => ({ ...item, indexedPromotion: item.promoted === true, resultLanguage }));
        }
        const mode = samplePromotionMode(response.responseHeader?.params?.q, config.samplePromotions);
        updateSampleExternalPromotion(externalPromotions, mode);
        return applySampleIndexedPromotion(
          results.map(item => ({
            ...item,
            title: demoResultTitle(item.title),
            description: demoResultText(item.description),
            demoThumbnail: demoThumbnails[item.url],
          })),
          response,
          mode,
        );
      },
    },
  });
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
        search.dataLayer.setSearchObject({ ...current, order: encodeURIComponent(sortOrder.value), page: 1 });
      }
    });
  }

  search.addSearchResultsWidget('search-results', {
    renderMethod: 'pagination',
    resultsPerPage: config.resultsPerPage,
    templates: {
      mainTemplate: {
        template: '<div id="search-result-list" class="searchstax-search-results"></div>',
        searchResultsContainerId: 'search-result-list',
      },
      searchResultTemplate: {
        template: '<article class="searchstax-search-result">{{#sampleIndexedPromotion}}<span class="sample-indexed-promotion">Sample indexed promotion</span>{{/sampleIndexedPromotion}}{{#indexedPromotion}}<span class="search-promotion-marker">Promoted</span>{{/indexedPromotion}}{{#demoThumbnail}}<img class="search-starter__result-thumbnail" src="{{demoThumbnail}}" alt="" width="384" height="216" loading="lazy">{{/demoThumbnail}}<h2{{#resultLanguage}} lang="{{resultLanguage}}"{{/resultLanguage}}><a href="{{url}}" data-result-id="{{uniqueId}}">{{title}}</a></h2><p class="search-starter__result-description"{{#resultLanguage}} lang="{{resultLanguage}}"{{/resultLanguage}}>{{description}}</p></article>',
      },
      noSearchResultTemplate: { template: ' ' },
    },
  });

  if (config.showFilters) {
    document.querySelector('.search-starter__filters').hidden = false;
    const facets = document.querySelector('#search-facets');
    if (usesDemoProfile) {
      new MutationObserver(() => {
        facets.querySelectorAll('[data-facet-value]').forEach(label => {
          const value = label.dataset.facetValue;
          const text = Object.hasOwn(demoFacets.labels, value) ? demoFacets.labels[value] : value;
          if (label.textContent !== text) label.textContent = text;
        });
      }).observe(facets, { childList: true, subtree: true });
    }
    search.addFacetsWidget('search-facets', {
      facetingType: 'or',
      itemsPerPageDesktop: 20,
      itemsPerPageMobile: 20,
      templates: {
        mainTemplateDesktop: { template: '<div class="search-facet-groups"></div>', facetsContainerClass: 'search-facet-groups' },
        mainTemplateMobile: { template: ' ' },
        facetItemContainerTemplate: {
          template: '<fieldset><legend>{{label}}</legend><div class="search-facet-options search-facet-choices"></div></fieldset>',
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
    templates: { mainTemplate: {
      template: '{{#results.length}}<nav class="search-starter__pagination" aria-label="Search result pages"><span tabindex="-1" data-page-range data-page-start="{{startResultIndex}}">{{startResultIndex}}–{{endResultIndex}} of {{totalResults}} results</span>{{^isFirstPage}}<button type="button" data-page-step="previous">Previous</button>{{/isFirstPage}}{{^isLastPage}}<button type="button" data-page-step="next">Next</button>{{/isLastPage}}</nav>{{/results.length}}',
    } },
  });
  search.dataLayer.setItemsPerPage(config.resultsPerPage);

  search.dataLayer.$loadingChange.subscribe(loading => {
    output.setAttribute('aria-busy', String(loading));
    if (loading) {
      status.textContent = 'Searching…';
      noResultsMessage.hidden = true;
      externalPromotions.hidden = true;
      promotionResponse = undefined;
      window.clearTimeout(requestTimer);
      requestTimer = window.setTimeout(() => {
        output.setAttribute('aria-busy', 'false');
        status.textContent = 'Search is unavailable. Try again in a moment.';
      }, 15000);
    }
  });

  function runSearch() {
    const term = query.value.trim();
    if (!term) {
      status.textContent = 'Enter a search term.';
      return;
    }
    void requestAnswer?.(term);
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
  setupStarterRelated(form, config, config, usesDemoProfile, query.value);
  runSearch();
} catch {
  submit.disabled = true;
  status.textContent = 'Couldn’t start search. Check the UI Kit and Search App configuration.';
}
