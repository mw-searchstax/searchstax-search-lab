<script setup>
import { setupFacetLimits } from "./facet-limits.js";
import { h, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import {
  SearchstaxExternalPromotionsWidget,
  SearchstaxFacetsWidget,
  SearchstaxPaginationWidget,
  SearchstaxResultWidget,
  SearchstaxSortingWidget,
  SearchstaxWrapper,
} from '@searchstax-inc/searchstudio-ux-vue';
import { connection, demo, design } from './config.js';
import { contentLanguageTag } from './content-language.js';
import { starterPassages } from './starter-passages.js';
import { setupStarterServices } from './starter-services.js';
import { thumbnailAlt } from './thumbnail-alt.js';
import { createCustomerSuggestionSource } from './customer-suggestions.js';
import { sampleSuggestionSource, setupSearchSuggestions } from './suggestions.js';
import { getAnalyticsSettings, setupResultTracking } from './result-tracking.js';
import { setupPaginationFocus } from './pagination-focus.js';
import { createResultPages } from './result-pages.js';
import { formatResultSummary } from './result-summary.js';
import { decodedSort, encodedSort, createSortController, readResponseSortOptions, readSortOptions } from './sorting.js';
import { installRecordedSearch } from './recorded-search.js';
import recordings from './recorded-searches.js';

installRecordedSearch(recordings);

function Passage({ parts }) {
  return parts.map(part => part.matched ? h('mark', { class: 'search-result-hit' }, part.text) : part.text);
}

const analytics = getAnalyticsSettings(connection);
const resultLanguage = contentLanguageTag(connection.language);
const isDemo = connection.source === 'demo' && connection.searchURL === demo.searchURL && connection.model === demo.model && resultLanguage === demo.language;
const initialQuery = connection.initialQuery || (isDemo ? 'rehabilitation' : '');
const resultPages = createResultPages();
const form = ref(null);
const filterHost = ref(null);
let facetLimits;
const queryField = ref(null);
const pagination = ref(null);
const resultHost = ref(null);
const answerHost = ref(null);
let services;
const status = ref('Connecting to search…');
const loadedResults = ref(0);
const totalResults = ref(0);
let api;
let sortController;
let loadingSubscription;
let timer;
let setSuggestionSource;

function publicLink(value) {
  try {
    const url = new URL(value);
    if (['https:', 'http:'].includes(url.protocol) && !url.username && !url.password) return url.href;
  } catch { /* An unmapped URL produces no link. */ }
  return '';
}



function afterSearch(items, response) {
  const total = response?.response?.numFound;
  if (typeof total !== 'number') return [];
  window.clearTimeout(timer);
  const options = readResponseSortOptions(response);
  if (sortController?.handle(options)) return [];
  const passages = starterPassages(response, isDemo);
  const mapped = items.flatMap(item => {
    const url = publicLink(item.url);
    return url ? [{
      ...item,
      url,
      ...passages(item),
      previewThumbnail: design.showThumbnails ? (isDemo ? demo.thumbnailPaths[url] : publicLink(item.thumbnail)) : '',
      previewThumbnailAlt: isDemo ? '' : thumbnailAlt(
        item.allFields,
        connection.thumbnailAltField,
        connection.thumbnailsWithoutAltAreDecorative,
      ),
    }] : [];
  });
  const results = design.paginationMode === 'loadMore'
    ? resultPages.collect(response.response.start ?? 0, mapped)
    : mapped;
  loadedResults.value = design.paginationMode === 'loadMore' ? results.length : 0;
  totalResults.value = total;
  status.value = formatResultSummary(design.summaryMode, {
    total, start: design.paginationMode === 'loadMore' ? 0 : (response.response.start ?? 0), visible: results.length,
  });
  return results;
}

function facetLabel(field, value) {
  return isDemo && field === 'demo_content_type_s' && Object.hasOwn(demo.facetLabels, value) ? demo.facetLabels[value] : value;
}

function sortChoices(data) {
  return readSortOptions(data);
}

function sortSearch(order) {
  api.dataLayer.setSearchObject({ ...api.dataLayer.searchObject, order: encodedSort(order), page: 1 });
}

function livePromotions(data) {
  return data?.externalPromotions?.flatMap(item => {
    const url = publicLink(item.url);
    return url ? [{ ...item, url }] : [];
  }) ?? [];
}

function runSearch(value) {
  const term = value.trim();
  if (!term) {
    status.value = 'Enter a search term.';
    return;
  }
  const current = api.dataLayer.searchObject;
  const next = { ...current, query: term, page: 1, facets: [] };
  void services?.search(term);
  if (current.query === term && current.page === 1 && !current.facets.length) api.search(next);
  else api.dataLayer.setSearchObject(next);
}

function initialized(instance) {
  api = instance;
  api.setCookiesDisabled(!analytics.trackApiKey);
  sortController = createSortController({
    enabled: design.showSorting,
    requested: design.startingSort,
    getSearchObject: () => instance.dataLayer.searchObject,
    setSearchObject: value => instance.dataLayer.setSearchObject(value),
  });
}

// The wrapper emits initialized before mounting its slot and the widgets.
watch(form, async (element) => {
  if (!element || loadingSubscription) return;
  await nextTick();
  if (!form.value) return;
  if (filterHost.value) facetLimits = setupFacetLimits(filterHost.value, () => design);
  loadingSubscription = api.dataLayer.$loadingChange.subscribe((loading) => {
    if (!loading) return;
    status.value = 'Searching…';
    window.clearTimeout(timer);
    timer = window.setTimeout(() => { status.value = 'Search is unavailable. Try again in a moment.'; }, 15000);
  });
  api.dataLayer.setItemsPerPage(design.resultsPerPage);
  // Keep Results Widget replacement-based so the accumulated projection from
  // afterSearch is rendered once; Pagination Widget still uses its native
  // infinite-scroll controls through this data-layer flag.
  api.dataLayer.setIsInfiniteScroll(design.paginationMode === 'loadMore');
  queryField.value.value = initialQuery;
  if (design.showSuggestions) {
    const source = isDemo ? sampleSuggestionSource : connection.suggesterURL
      ? createCustomerSuggestionSource({ token: connection.searchAuth, language: connection.language }, connection.suggesterURL)
      : null;
    if (source) {
      setSuggestionSource = setupSearchSuggestions(element, 'vue-search-suggestions');
      setSuggestionSource(source);
    }
  }
  services = setupStarterServices(element, answerHost.value, connection, design);
  if (initialQuery) runSearch(initialQuery);
  else status.value = 'Enter a search term.';
}, { flush: 'post' });

watch(resultHost, (host, _, onCleanup) => {
  if (host) {
    const stop = setupResultTracking(host, api);
    if (stop) onCleanup(stop);
  }
}, { flush: 'post' });

watch(pagination, (host, _, onCleanup) => {
  if (host) onCleanup(setupPaginationFocus(host, () => api));
}, { flush: 'post' });

onBeforeUnmount(() => {
  facetLimits?.destroy();
  services?.clear();
  setSuggestionSource?.(null);
  if (loadingSubscription) api.dataLayer.$loadingChange.unsubscribe(loadingSubscription);
  window.clearTimeout(timer);
});
</script>

<template>
  <main class="search-starter">
    <img v-if="design.logoURL" class="search-starter__logo" :src="design.logoURL" alt="Company logo"
      referrerpolicy="no-referrer" @error="$event.target.hidden = true">
    <h1>{{ isDemo ? 'Search Central County' : 'Search' }}</h1>
    <p v-if="isDemo">Search fictional university health content with the SearchStax Vue UI Kit.</p>
    <p v-if="!connection.searchURL || !connection.searchAuth">Set the Select endpoint and read-only token in src/config.js to start searching.</p>
    <SearchstaxWrapper v-else
      :searchURL="connection.searchURL" :searchAuth="connection.searchAuth" :model="connection.model"
      :language="connection.language" authType="token" suggesterURL="" v-bind="analytics"
      :router="{ enabled: false }" :afterSearch="afterSearch" @initialized="initialized"
    >
      <div>
        <form ref="form" class="search-starter__form" role="search" @submit.prevent="runSearch(queryField.value)">
          <label class="search-starter__sr-only" for="starter-query">{{ design.searchFieldText }}</label>
          <input id="starter-query" ref="queryField" type="search"
            :placeholder="design.searchFieldText" autocomplete="off" required>
          <button type="submit" class="search-starter__submit">{{ design.searchButtonText }}</button>
        </form>
      </div>
      <div ref="answerHost"></div>
      <p v-if="design.summaryPlacement !== 'below'" role="status" data-result-summary>{{ status }}</p>
      <SearchstaxSortingWidget v-if="design.showSorting && design.sortPlacement !== 'below'">
        <template #sorting="{ sortingData, selectedSorting }">
          <label v-if="sortingData?.searchExecuted && sortChoices(sortingData).length" class="search-starter__sort">
            {{ design.sortLabel || 'Sort by' }}
            <select :aria-label="design.sortLabel || 'Sort by'" :value="decodedSort(selectedSorting)" @change="sortSearch($event.target.value)">
              <option v-for="choice in sortChoices(sortingData)" :key="choice.order" :value="choice.order">{{ choice.label }}</option>
            </select>
          </label>
        </template>
      </SearchstaxSortingWidget>
      <Teleport defer to="#starter-promotions-below" :disabled="design.bannerPlacement === 'above'">
        <SearchstaxExternalPromotionsWidget>
          <template #externalPromotions="{ externalPromotionsData }">
            <section v-if="livePromotions(externalPromotionsData).length" aria-label="External promotions">
              <div v-for="entry in livePromotions(externalPromotionsData)" :key="entry.id ?? entry.url" class="search-promotion-banner">
                <strong class="search-promotion-heading">{{ design.promotionHeading }}</strong>
                <a :href="entry.url" :lang="resultLanguage" referrerpolicy="no-referrer">{{ entry.name || entry.url }}</a>
                <p v-if="entry.description" :lang="resultLanguage">{{ entry.description }}</p>
              </div>
            </section>
          </template>
        </SearchstaxExternalPromotionsWidget>
      </Teleport>
      <div class="search-starter__body">
        <aside ref="filterHost" v-if="design.showFilters" class="search-starter__filters" aria-label="Filter search results">
          <SearchstaxFacetsWidget :facetingType="design.facetMode" :itemsPerPageDesktop="Number.MAX_SAFE_INTEGER" :itemsPerPageMobile="Number.MAX_SAFE_INTEGER">
            <template #desktopFacets="{ facetsTemplateDataDesktop, onUpdateRefDesktop, isChecked, selectFacet }">
              <fieldset v-for="facet in facetsTemplateDataDesktop?.facets" :key="facet.name" :data-facet="facet.name">
                <legend>{{ facet.label || facet.name }}</legend>
                <div class="search-facet-choices">
                  <div v-for="option in facet.values" :key="option.value" :ref="element => onUpdateRefDesktop(element, option)">
                    <label>
                      <input type="checkbox" :checked="Boolean(isChecked(option))" :disabled="option.disabled"
                        @click="selectFacet(option.value + '-desktop', $event, option, true)">
                      <span>{{ facetLabel(facet.name, option.value) }}</span><small>{{ option.count }}</small>
                    </label>
                  </div>
                </div>
              </fieldset>
            </template>
            <template #mobileFacets></template>
          </SearchstaxFacetsWidget>
        </aside>
        <div ref="resultHost">
          <SearchstaxResultWidget renderMethod="pagination" :resultsPerPage="design.resultsPerPage">
            <template #results="{ searchResults }">
              <div class="searchstax-search-results">
                <article v-for="item in searchResults" :key="item.uniqueId || item.url" class="searchstax-search-result">
                  <span v-if="item.promoted" class="search-promotion-marker">{{ design.promotionBadge }}</span>
                  <img v-if="item.previewThumbnail && item.previewThumbnailAlt !== null" class="search-starter__result-thumbnail" :src="item.previewThumbnail"
                    :alt="item.previewThumbnailAlt" :lang="resultLanguage" loading="lazy" referrerpolicy="no-referrer">
                  <span v-if="item.ribbonParts.length" class="searchstax-search-result-ribbon"><Passage :parts="item.ribbonParts" /></span>
                  <h2 :lang="resultLanguage"><a :href="item.url" :data-result-id="item.uniqueId" referrerpolicy="no-referrer"><Passage :parts="item.titleParts" /></a></h2>
                  <p v-if="item.descriptionParts.length" class="search-starter__result-description" :lang="resultLanguage"><Passage :parts="item.descriptionParts" /></p>
                  <p v-for="(field, i) in item.otherFields" :key="i">{{ field.label ? field.label + ': ' : '' }}<Passage :parts="field.parts" /></p>
                </article>
              </div>
            </template>
            <template #noResult>
              <p class="search-starter__no-results">{{ design.noResultsText }}</p>
            </template>
          </SearchstaxResultWidget>
          <div ref="pagination" tabindex="-1" role="group" aria-label="Search result pagination">
            <SearchstaxPaginationWidget>
              <template #pagination="{ paginationData }">
                <nav v-if="design.paginationMode !== 'loadMore' && paginationData?.totalResults" class="search-starter__pagination" aria-label="Search result pages">
                  <span tabindex="-1" data-page-range :data-page-start="paginationData.startResultIndex">{{ paginationData.startResultIndex }}–{{ paginationData.endResultIndex }} of {{ paginationData.totalResults }} results</span>
                  <button v-if="!paginationData.isFirstPage" type="button" data-page-step="previous">Previous</button>
                  <button v-if="!paginationData.isLastPage" type="button" data-page-step="next">Next</button>
                </nav>
              </template>
              <template #infiniteScroll="{ paginationData, nextPage }">
                <button v-if="design.paginationMode === 'loadMore' && paginationData?.totalResults && !paginationData.isLastPage" type="button"
                  class="searchstax-pagination-load-more search-starter__load-more"
                  data-test-id="searchstax-pagination-load-more" @click="nextPage">
                  {{ design.loadMoreText }}
                </button>
              </template>
            </SearchstaxPaginationWidget>
            <span :class="{ 'search-starter__sr-only': design.paginationMode !== 'loadMore' }" role="status" :aria-live="design.summaryMode === 'range' ? 'off' : 'polite'" data-page-announcement>
              {{ design.paginationMode === 'loadMore' && loadedResults ? `Loaded ${loadedResults} of ${totalResults} results${loadedResults >= totalResults ? ' (all results loaded)' : ''}` : '' }}
            </span>
          </div>
        </div>
        <SearchstaxSortingWidget v-if="design.showSorting && design.sortPlacement === 'below'">
          <template #sorting="{ sortingData, selectedSorting }">
            <label v-if="sortingData?.searchExecuted && sortChoices(sortingData).length" class="search-starter__sort">
              {{ design.sortLabel || 'Sort by' }}
              <select :aria-label="design.sortLabel || 'Sort by'" :value="decodedSort(selectedSorting)" @change="sortSearch($event.target.value)">
                <option v-for="choice in sortChoices(sortingData)" :key="choice.order" :value="choice.order">{{ choice.label }}</option>
              </select>
            </label>
          </template>
        </SearchstaxSortingWidget>
      </div>
      <div id="starter-promotions-below"></div>
      <p v-if="design.summaryPlacement === 'below'" role="status" data-result-summary>{{ status }}</p>
    </SearchstaxWrapper>
  </main>
</template>
