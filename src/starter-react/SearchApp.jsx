import React, { useEffect, useRef, useState } from 'react';
import {
  SearchstaxExternalPromotionsWidget,
  SearchstaxFacetsWidget,
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
import { applySampleIndexedPromotion, sampleExternalPromotion, samplePromotionMode, samplePromotionQuery } from './promotions.js';

const analytics = getAnalyticsSettings(connection);
const resultLanguage = contentLanguageTag(connection.language);
const isDemo = connection.searchURL === demo.searchURL && connection.model === demo.model && resultLanguage === demo.language;
const initialQuery = connection.initialQuery || (isDemo ? (design.samplePromotions === 'off' ? 'rehabilitation' : samplePromotionQuery) : '');

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
          {item.sampleIndexedPromotion && <span className="sample-indexed-promotion">Sample indexed promotion</span>}
          {!isDemo && item.promoted && <span className="search-promotion-marker">Promoted</span>}
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
    <fieldset key={facet.name}>
      <legend>{facet.label || facet.name}</legend>
      <div className="search-facet-choices">
        {facet.values.map((value, index) => {
          const key = index + facet.name;
          containers[key] ??= React.createRef();
          const label = isDemo && Object.hasOwn(demo.facetLabels, value.value) ? demo.facetLabels[value.value] : value.value;
          return (
            <div key={value.value} ref={containers[key]}>
              <label className={'desktop-' + key}>
                <input type="checkbox" checked={Boolean(isChecked(value))} readOnly disabled={value.disabled}
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
  const choices = isDemo ? demo.sortOptions : data?.sortOptions?.map(item => ({ label: item.value, order: item.key }));
  if (!data?.searchExecuted || !choices?.length) return null;
  return (
    <label className="search-starter__sort">
      Sort by
      <select value={selected} onChange={(event) => {
        const current = api.dataLayer.searchObject;
        api.dataLayer.setSearchObject({ ...current, order: encodeURIComponent(event.target.value), page: 1 });
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
          <span className="search-promotion-marker">Promoted</span>
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
  const resultHost = useRef(null);
  const answerHost = useRef(null);
  const services = useRef(null);
  const setSuggestionSource = useRef(null);

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
    const loading = api.dataLayer.$loadingChange;
    const subscription = loading.subscribe((value) => {
      if (!value) return;
      setStatus('Searching…');
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setStatus('Search is unavailable. Try again in a moment.'), 15000);
    });
    api.dataLayer.setItemsPerPage(design.resultsPerPage);
    services.current = setupStarterServices(form.current, answerHost.current, connection, design);
    if (initialQuery) runSearch(initialQuery);
    else setStatus('Enter a search term.');
    return () => {
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

  const modes = isDemo ? samplePromotionMode(summary.query, design.samplePromotions) : 'off';
  return <>
    <form className="search-starter__form" role="search" ref={form}
      onSubmit={(event) => { event.preventDefault(); runSearch(input.current.value); }}>
      <label className="search-starter__sr-only" htmlFor="starter-query">{design.searchFieldText}</label>
      <input id="starter-query" type="search" defaultValue={initialQuery} placeholder={design.searchFieldText} ref={input} autoComplete="off" required />
      <button type="submit" className="search-starter__submit">{design.searchButtonText}</button>
    </form>
    <div ref={answerHost} />
    <p role="status">{status}</p>
    {design.showSorting && <SearchstaxSortingWidget searchSortingTemplate={(data, _, selected) => sortControls(data, selected, api)} />}
    {(modes === 'external' || modes === 'both') &&
      <section className="sample-external-promotion search-promotion-banner" aria-label="Sample external promotion">
        <p className="sample-external-promotion__label">Sample external promotion</p>
        <a href={sampleExternalPromotion.url} referrerPolicy="no-referrer">{sampleExternalPromotion.title}</a>
      </section>}
    {!isDemo && <SearchstaxExternalPromotionsWidget searchExternalPromotionsTemplate={livePromotions} />}
    <div className="search-starter__body">
      {design.showFilters &&
        <aside className="search-starter__filters" aria-label="Filter search results">
          <SearchstaxFacetsWidget facetingType="or" itemsPerPageDesktop={20} itemsPerPageMobile={20}
            facetsTemplateDesktop={facetControls} facetsTemplateMobile={() => null} />
        </aside>}
      <div ref={resultHost}>
        <SearchstaxResultWidget renderMethod="pagination" resultsPerPage={design.resultsPerPage}
          resultsTemplate={resultCards}
          noResultTemplate={() => <p className="search-starter__no-results">{design.noResultsText}</p>} />
        <div ref={pagination} tabIndex={-1} role="group" aria-label="Search result pagination">
          {pageControls(summary)}
          <span className="search-starter__sr-only" role="status" data-page-announcement="" />
        </div>
      </div>
    </div>
  </>;
}

export default function SearchApp() {
  const [api, setApi] = useState(null);
  const [summary, setSummary] = useState({ query: '' });
  const [status, setStatus] = useState('Connecting to search…');
  const timer = useRef();

  function afterSearch(items, response) {
    const total = response?.response?.numFound;
    if (typeof total !== 'number') return [];
    window.clearTimeout(timer.current);
    const query = response.responseHeader?.params?.q ?? '';
    // The requested page can change while the previous response is still on screen.
    const start = response.response.start ?? 0;
    const end = Math.min(total, start + (response.response.docs?.length ?? design.resultsPerPage));
    setSummary({ query, start, end, total });
    setStatus(total + (total === 1 ? ' result' : ' results'));
    const passages = starterPassages(response, isDemo);
    const results = items.flatMap((item) => {
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
    return isDemo ? applySampleIndexedPromotion(results, response, samplePromotionMode(query, design.samplePromotions)) : results;
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
        initialized={(instance) => { instance.setCookiesDisabled(!analytics.trackApiKey); setApi(instance); }}>
        {api && <SearchExperience api={api} summary={summary} status={status} setStatus={setStatus} timer={timer} />}
      </SearchstaxWrapper>
    </main>
  );
}
