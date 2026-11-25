import { setupFacetLimits } from './facet-limits.js';
import React, { useEffect, useRef, useState } from 'react';
import {
  SearchstaxExternalPromotionsWidget,
  SearchstaxFacetsWidget,
  SearchstaxPaginationWidget,
  SearchstaxResultWidget,
  SearchstaxSortingWidget,
  SearchstaxWrapper,
} from '@searchstax-inc/searchstudio-ux-react';
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
import { decodedSort, encodedSort, createSortController, readResponseSortOptions, readSortOptions } from './sorting.js';

const analytics = getAnalyticsSettings(connection);
const resultLanguage = contentLanguageTag(connection.language);
const isDemo = connection.searchURL === demo.searchURL && connection.model === demo.model && resultLanguage === demo.language;
const initialQuery = connection.initialQuery || (isDemo ? 'rehabilitation' : '');
const resultPages = createResultPages();

function publicLink(value) {
  try {
    const url = new URL(value);
    if (['https:', 'http:'].includes(url.protocol) && !url.username && !url.password) return url.href;
  } catch { /* An unmapped URL produces no link. */ }
  return '';
}

function renderParts(parts) {
  return parts.map((part, index) => part.matched
    ? <mark className="search-result-hit" key={index}>{part.text}</mark> : part.text);
}

function resultCards(results) {
  return (
    <div className="searchstax-search-results">
      {results.map((item) => (
        <article className="searchstax-search-result" key={item.uniqueId || item.url}>
          {item.promoted && <span className="search-promotion-marker">{design.promotionBadge}</span>}
          {item.previewThumbnail && item.previewThumbnailAlt !== null && (
            <img className="search-starter__result-thumbnail" src={item.previewThumbnail} alt={item.previewThumbnailAlt} lang={resultLanguage} loading="lazy" referrerPolicy="no-referrer" />
          )}
          {item.ribbonParts.length > 0 && <span className="searchstax-search-result-ribbon">{renderParts(item.ribbonParts)}</span>}
          <h2 lang={resultLanguage}><a href={item.url} data-result-id={item.uniqueId} referrerPolicy="no-referrer">{renderParts(item.titleParts)}</a></h2>
          {item.descriptionParts.length > 0 && <p className="search-starter__result-description" lang={resultLanguage}>{renderParts(item.descriptionParts)}</p>}
          {item.otherFields.map((field, index) => <p key={index}>{field.label && field.label + ': '}{renderParts(field.parts)}</p>)}
        </article>
      ))}
    </div>
  );
}

function facetControls(data, containers, isExpanded, toggle, selectFacet, isChecked) {
  if (!data?.facets?.length) return null;
  return data.facets.map((facet) => (
    <fieldset key={facet.name} data-facet={facet.name}>
      <legend>{facet.label || facet.name}</legend>
      <div className="search-facet-choices">
        {facet.values.map((value, index) => {
          const key = index + facet.name;
          containers[key] ??= React.createRef();
          const label = isDemo && facet.name === 'demo_content_type_s' && Object.hasOwn(demo.facetLabels, value.value) ? demo.facetLabels[value.value] : value.value;
          return (
            <div key={value.value} ref={containers[key]}>
              <label className={'desktop-' + key}>
                <input type="checkbox" className="searchstax-facet-input-checkbox" checked={Boolean(isChecked(value))} readOnly disabled={value.disabled}
                  onClick={(event) => selectFacet(key, event, value, true)} />
                <span>{label}</span><small>{value.count}</small>
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  ));
}

function sortControls(data, selected, api) {
  const choices = readSortOptions(data);
  if (!data?.searchExecuted || !choices?.length) return null;
  return (
    <label className="search-starter__sort">
      {design.sortLabel || 'Sort by'}
      <select aria-label={design.sortLabel || 'Sort by'} value={decodedSort(selected)} onChange={(event) => {
        const current = api.dataLayer.searchObject;
        api.dataLayer.setSearchObject({ ...current, order: encodedSort(event.target.value), page: 1 });
      }}>
        {choices.map(option => <option key={option.order} value={option.order}>{option.label}</option>)}
      </select>
    </label>
  );
}

function pageControls({ start, end, total }) {
  if (!total) return null;
  return (
    <nav className="search-starter__pagination" aria-label="Search result pages">
      <span tabIndex={-1} data-page-range="" data-page-start={start + 1}>{start + 1}–{end} of {total} results</span>
      {start > 0 && <button type="button" data-page-step="previous">Previous</button>}
      {end < total && <button type="button" data-page-step="next">Next</button>}
    </nav>
  );
}

function livePromotions(data) {
  const links = data?.externalPromotions?.flatMap(item => {
    const url = publicLink(item.url);
    return url ? [{ ...item, url }] : [];
  });
  if (!links?.length) return null;
  return (
    <section aria-label="External promotions">
      {links.map(item => (
        <div key={item.id ?? item.url} className="search-promotion-banner">
          <strong className="search-promotion-heading">{design.promotionHeading}</strong>
          <a href={item.url} lang={resultLanguage} referrerPolicy="no-referrer">{item.name || item.url}</a>
          {item.description && <p lang={resultLanguage}>{item.description}</p>}
        </div>
      ))}
    </section>
  );
}

function SearchExperience({ api, summary, status, setStatus, timer }) {
  const form = useRef(null);
  const input = useRef(null);
  const pagination = useRef(null);
  const filterHost = useRef(null);
  const resultHost = useRef(null);
  const answerHost = useRef(null);
  const services = useRef(null);
  const setSuggestionSource = useRef(null);
  const sortWidget = design.showSorting ? <SearchstaxSortingWidget searchSortingTemplate={(data, _, selected) => sortControls(data, selected, api)} /> : null;

  function runSearch(query) {
    const term = query.trim();
    if (!term) {
      setStatus('Enter a search term.');
      return;
    }
    const current = api.dataLayer.searchObject;
    const next = { ...current, query: term, page: 1, facets: [] };
    void services.current?.search(term);
    if (current.query === term && current.page === 1 && !current.facets.length) api.search(next);
    else api.dataLayer.setSearchObject(next);
  }

  useEffect(() => {
    const limits = filterHost.current && setupFacetLimits(filterHost.current, () => design);
    const loading = api.dataLayer.$loadingChange;
    const subscription = loading.subscribe((value) => {
      if (!value) return;
      setStatus('Searching…');
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setStatus('Search is unavailable. Try again in a moment.'), 15000);
    });
    api.dataLayer.setItemsPerPage(design.resultsPerPage);
    // Keep Results Widget replacement-based so the accumulated projection from
    // afterSearch is rendered once; Pagination Widget still uses its native
    // infinite-scroll controls through this data-layer flag.
    api.dataLayer.setIsInfiniteScroll(design.paginationMode === 'loadMore');
    services.current = setupStarterServices(form.current, answerHost.current, connection, design);
    if (initialQuery) runSearch(initialQuery);
    else setStatus('Enter a search term.');
    return () => {
      limits?.destroy();
      services.current?.clear();
      loading.unsubscribe(subscription);
      window.clearTimeout(timer.current);
    };
  }, [api]);

  useEffect(() => {
    if (!design.showSuggestions) return;
    const source = isDemo ? sampleSuggestionSource : connection.suggesterURL
      ? createCustomerSuggestionSource({ token: connection.searchAuth, language: connection.language }, connection.suggesterURL)
      : null;
    if (!source) return;
    setSuggestionSource.current ??= setupSearchSuggestions(form.current, 'react-search-suggestions');
    setSuggestionSource.current(source);
    return () => setSuggestionSource.current(null);
  }, []);

  useEffect(() => setupResultTracking(resultHost.current, api), [api]);
  useEffect(() => setupPaginationFocus(pagination.current, () => api), [api]);

  return <>
    <form className="search-starter__form" role="search" ref={form}
      onSubmit={(event) => { event.preventDefault(); runSearch(input.current.value); }}>
      <label className="search-starter__sr-only" htmlFor="starter-query">{design.searchFieldText}</label>
      <input id="starter-query" type="search" defaultValue={initialQuery} placeholder={design.searchFieldText} ref={input} autoComplete="off" required />
      <button type="submit" className="search-starter__submit">{design.searchButtonText}</button>
    </form>
    <div ref={answerHost} />
    <p role="status">{status}</p>
    {design.sortPlacement === 'below' ? null : sortWidget}
    {design.bannerPlacement === 'above' && <SearchstaxExternalPromotionsWidget searchExternalPromotionsTemplate={livePromotions} />}
    <div className="search-starter__body">
      {design.showFilters &&
        <aside ref={filterHost} className="search-starter__filters" aria-label="Filter search results">
          <SearchstaxFacetsWidget facetingType={design.facetMode} itemsPerPageDesktop={Number.MAX_SAFE_INTEGER} itemsPerPageMobile={Number.MAX_SAFE_INTEGER}
            facetsTemplateDesktop={facetControls} facetsTemplateMobile={() => null} />
        </aside>}
      <div ref={resultHost}>
        <SearchstaxResultWidget renderMethod="pagination" resultsPerPage={design.resultsPerPage}
          resultsTemplate={resultCards}
          noResultTemplate={() => <p className="search-starter__no-results">{design.noResultsText}</p>} />
        <div ref={pagination} tabIndex={-1} role="group" aria-label="Search result pagination">
          {design.paginationMode === 'loadMore' ? (
            <SearchstaxPaginationWidget
              infiniteScrollTemplate={(data, nextPage) => (
                <button type="button" className="searchstax-pagination-load-more search-starter__load-more"
                  data-test-id="searchstax-pagination-load-more" onClick={nextPage}>
                  {design.loadMoreText}
                </button>
              )}
            />
          ) : pageControls(summary)}
          <span className={design.paginationMode === 'loadMore' ? undefined : 'search-starter__sr-only'} role="status" data-page-announcement="">
            {design.paginationMode === 'loadMore' && summary.end > 0
              ? `Loaded ${summary.end} of ${summary.total} results${summary.end >= summary.total ? ' (all results loaded)' : ''}`
              : ''}
          </span>
        </div>
      </div>
    </div>
    {design.sortPlacement === 'below' && sortWidget}
    {design.bannerPlacement === 'below' && <SearchstaxExternalPromotionsWidget searchExternalPromotionsTemplate={livePromotions} />}
  </>;
}

export default function SearchApp() {
  const [api, setApi] = useState(null);
  const [summary, setSummary] = useState({ start: 0, end: 0, total: 0 });
  const [status, setStatus] = useState('Connecting to search…');
  const timer = useRef();
  const sortController = useRef(null);

  function afterSearch(items, response) {
    const total = response?.response?.numFound;
    if (typeof total !== 'number') return [];
    window.clearTimeout(timer.current);
    // The requested page can change while the previous response is still on screen.
    setStatus(total + (total === 1 ? ' result' : ' results'));
    const options = readResponseSortOptions(response);
    if (sortController.current?.handle(options)) return [];
    const passages = starterPassages(response, isDemo);
    const mapped = items.flatMap((item) => {
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
    const start = response.response.start ?? 0;
    const results = design.paginationMode === 'loadMore'
      ? resultPages.collect(start, mapped)
      : mapped;
    const end = design.paginationMode === 'loadMore'
      ? results.length
      : Math.min(total, start + (response.response.docs?.length ?? design.resultsPerPage));
    setSummary({ start: design.paginationMode === 'loadMore' ? 0 : start, end, total });
    return results;
  }

  if (!connection.searchURL || !connection.searchAuth) {
    return <main className="search-starter"><p>Set the Select endpoint and read-only token in src/config.js to start searching.</p></main>;
  }

  return (
    <main className="search-starter">
      {design.logoURL && <img className="search-starter__logo" src={design.logoURL} alt="Company logo"
        referrerPolicy="no-referrer" onError={event => { event.currentTarget.hidden = true; }} />}
      <h1>{isDemo ? 'Search Central County' : 'Search'}</h1>
      {isDemo && <p>Search fictional university health content with the SearchStax React UI Kit.</p>}
      <SearchstaxWrapper searchURL={connection.searchURL} searchAuth={connection.searchAuth}
        authType="token" model={connection.model} language={connection.language}
        suggesterURL=""
        {...analytics} router={{ enabled: false }} afterSearch={afterSearch}
        initialized={(instance) => {
          instance.setCookiesDisabled(!analytics.trackApiKey);
          sortController.current = createSortController({
            enabled: design.showSorting,
            requested: design.startingSort,
            getSearchObject: () => instance.dataLayer.searchObject,
            setSearchObject: value => instance.dataLayer.setSearchObject(value),
          });
          setApi(instance);
        }}>
        {api && <SearchExperience api={api} summary={summary} status={status} setStatus={setStatus} timer={timer} />}
      </SearchstaxWrapper>
    </main>
  );
}
