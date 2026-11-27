import { setupPublishedFacets } from './published-facets.js';
import { pageControls, showPaginationAt } from './pagination-focus.js';
import { facetGroupScope, selectedFacetGroups, visibleFacetFilters } from './facet-groups.js';
import { placePromotionBanners, renderPromotionBanners, updatePromotionLabels } from './promotion-display.js';
import { createSearchRecovery } from './search-recovery';
import { readAppConfiguration, featureStatus, profileStatus, type Profile, type AppConfiguration } from './app-configuration.js';
import { resultMappingNotice, appendResultCard } from './result-card.js';
import type { DesignSettings } from './design';
import { formatResultSummary, placeResultSummary, type ResultWindow } from './result-summary.js';
import { contentLanguageTag } from './content-language.js';
import { readAnswerEndpoint, setupCustomerAnswers } from './customer-answers.js';
import { createCustomerSuggestionSource } from './customer-suggestions.js';
import {
  CustomerSearchError,
  CustomerSearchTokenError,
  readCustomerEndpoint,
  searchBuildApp,
  type CustomerConnection,
  type BuildPage,
  type BuildSearch,
} from './customer-search';

export function setupCustomerPreview(
  root: Element,
  getDesign: () => DesignSettings,
  onModeChange: (query: string | null) => void,
  onResultSettings: () => void,
) {
  const get = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const form = get<HTMLFormElement>('[data-customer-connect]');
  const settingsSummary = root.querySelector<HTMLElement>('[data-app-settings-summary]');
  const connect = get<HTMLButtonElement>('[data-customer-submit]');
  const formStatus = get('[data-customer-connect-status]');
  const endpoint = get<HTMLInputElement>('#lab-customer-endpoint');
  const token = get<HTMLInputElement>('#lab-customer-token');
  const profile = get<HTMLInputElement>('#lab-customer-profile');
  const snapshot = get<HTMLInputElement>('#lab-app-configuration');
  let importVersion = 0;
  const connectionOptions = get<HTMLDetailsElement>('[data-customer-options]');
  const language = get<HTMLInputElement>('#lab-customer-language');
  const answerEndpoint = get<HTMLInputElement>('#lab-customer-answer-endpoint');
  const suggestEndpoint = get<HTMLInputElement>('#lab-customer-suggest-endpoint');
  const relatedEndpoint = get<HTMLInputElement>('#lab-related-endpoint');
  const discoveryKey = get<HTMLInputElement>('#lab-discovery-key');
  relatedEndpoint.addEventListener('input', () => { discoveryKey.value = ''; });
  const testQuery = get<HTMLInputElement>('#lab-customer-query');
  const endpointFields = [endpoint, answerEndpoint, suggestEndpoint];
  const panel = get('[data-customer-preview]');
  const answers = setupCustomerAnswers(get('[data-single-experience]'));
  const source = get('[data-customer-source]');
  const status = get('[data-customer-status]');
  const summaryToolbar = status.parentElement!;
  let resultWindow: ResultWindow | undefined;
  const searchFeedback = get('[data-customer-search-feedback]');
  const previousResults = get('[data-customer-previous-results]');
  const layout = get('[data-customer-layout]');
  const facets = get('[data-customer-facets]');
  const facetFields = get('[data-customer-facet-fields]');
  const facetHint = get('[data-customer-facet-hint]');
  const sort = get<HTMLSelectElement>('#lab-customer-sort');
  const sortField = get('[data-customer-sort-field]');
  const sortToolbar = sortField.parentElement;
  const sortHint = get('[data-customer-sort-hint]');
  const promotions = get('[data-customer-promotions]');
  const grid = get('[data-customer-grid]');
  const empty = get('[data-customer-empty]');
  const pager = get('[data-customer-pager]');
  const bottomPager = pageControls(pager);
  const pagers = [pageControls(panel.querySelector<HTMLElement>('[data-pager-position="above"]')!), bottomPager];
  const loadMore = document.createElement('button');
  loadMore.type = 'button';
  loadMore.className = 'search-lab__load-more';
  loadMore.textContent = getDesign().loadMoreText;
  loadMore.hidden = true;
  pager.insertBefore(loadMore, bottomPager.range);
  const searchForm = get<HTMLFormElement>('[data-lab-search-form]');
  const queryInput = get<HTMLInputElement>('#lab-query');
  let place: HTMLElement = searchForm;
  let trigger: HTMLElement = queryInput;
  let displayedStart = 0;
  let failedSearch: BuildSearch | null = null;
  const recovery = createSearchRecovery(queryInput, () => {
    if (failedSearch && connection) void load(connection, failedSearch);
  });
  const fieldMessage = document.createElement('p');
  fieldMessage.id = 'lab-connect-field-error';
  fieldMessage.className = 'search-lab__feedback';
  fieldMessage.dataset.tone = 'error';
  fieldMessage.setAttribute('role', 'status');
  let invalidField: HTMLElement | undefined;
  function clearFieldError() {
    if (invalidField) {
      invalidField.removeAttribute('aria-invalid');
      const ids = invalidField.getAttribute('aria-describedby')?.split(' ').filter(id => id !== fieldMessage.id);
      if (ids?.length) invalidField.setAttribute('aria-describedby', ids.join(' '));
      else invalidField.removeAttribute('aria-describedby');
    }
    invalidField = undefined;
    fieldMessage.remove();
  }
  function fieldError(field: HTMLElement, text: string) {
    clearFieldError();
    formStatus.textContent = '';
    if (connectionOptions.contains(field)) connectionOptions.open = true;
    invalidField = field;
    field.after(fieldMessage);
    fieldMessage.textContent = text;
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), fieldMessage.id].filter(Boolean).join(' '));
    field.focus({ preventScroll: true });
    field.scrollIntoView({ block: 'center', behavior: 'instant' });
  }
  form.addEventListener('input', event => {
    importVersion++;
    if (request && !connection) {
      request.abort();
      request = null;
      formStatus.textContent = '';
      connect.removeAttribute('aria-disabled');
    }
    if (event.target === invalidField) clearFieldError();
    connect.textContent = 'Connect';
  });
  let connection: CustomerConnection | null = null;
  let suggestionSource: ReturnType<typeof createCustomerSuggestionSource> | null = null;
  let options: BuildSearch | null = null;
  let latestPage: BuildPage | null = null;
  let request: AbortController | null = null;
  let activePaginationMode: DesignSettings['paginationMode'] = getDesign().paginationMode;
  let lastStartingSort = getDesign().startingSort;
  let lastShowSorting = getDesign().showSorting;
  let tokenDestinations: string[] | null = null;
  const paginationMode = () => getDesign().paginationMode;

  function emitSortOptions(choices: BuildPage['sorts']) {
    panel.dispatchEvent(new CustomEvent('lab-sort-options', {
      bubbles: true,
      detail: { choices: choices.map(choice => ({ value: choice.value, label: choice.label })) },
    }));
  }

  function applySortPresentation() {
    const design = getDesign();
    const label = sortField.querySelector<HTMLElement>('[data-sort-label]');
    if (label) label.textContent = design.sortLabel;
    if (design.sortPlacement === 'below') {
      if (sortField.previousElementSibling !== grid) grid.after(sortField);
    } else if (sortField.parentElement !== sortToolbar) sortToolbar?.append(sortField);
  }

  function clearFormToken() {
    token.value = '';
    tokenDestinations = null;
  }

  for (const [index, field] of endpointFields.entries()) {
    field.addEventListener('input', () => {
      if (tokenDestinations && field.value.trim() !== tokenDestinations[index]) clearFormToken();
    });
  }
  token.addEventListener('input', () => { tokenDestinations = null; });
  endpoint.addEventListener('change', () => {
    let url: URL;
    try { url = new URL(endpoint.value); } catch { return; }
    if (!url.searchParams.has('model') && !url.searchParams.has('language')) return;
    const params = url.searchParams;
    const model = params.get('model')?.trim();
    const code = params.get('language')?.trim();
    url.search = '';
    if (!readCustomerEndpoint(url.href)) return;
    endpoint.value = url.href;
    profile.value = model || '';
    language.value = code || '';
    formStatus.textContent = 'Read the profile or language from your search URL. Review the settings below.';
    connectionOptions.open = true;
  });

  form.addEventListener('invalid', event => {
    if (event.target instanceof HTMLElement && connectionOptions.contains(event.target)) {
      connectionOptions.open = true;
    }
  }, true);

  function updateVisibility() {
    const design = getDesign();
    for (const { element } of pagers) {
      element.hidden = !latestPage?.resultCount || !showPaginationAt(design, element.dataset.pagerPosition!);
    }
    pager.setAttribute('aria-label', showPaginationAt(design, 'above') && showPaginationAt(design, 'below')
      ? 'Search result pages below results' : 'Search result pages');
    placeResultSummary(status, design.summaryPlacement, summaryToolbar, layout);
    if (resultWindow) {
      const text = formatResultSummary(design.summaryMode, resultWindow);
      if (status.textContent !== text) status.textContent = text;
    }
    applySortPresentation();
    facets.hidden = !design.filters;
    layout.dataset.filters = design.filters ? 'on' : 'off';
    sortField.hidden = !design.showSorting || !latestPage?.sorts.length;
    sortHint.hidden = !design.showSorting || Boolean(latestPage?.sorts.length);
    if (latestPage?.mappingsKnown && latestPage.total === 0) empty.textContent = design.noResultsText;
  }

  let displayedFacetGroups: string[] | undefined;
  const facetView = setupPublishedFacets(facetFields, getDesign, (filters, label, input) =>
    run({ filters }, label, input));
  function renderFacets(page: BuildPage, active: BuildSearch) {
    displayedFacetGroups = selectedFacetGroups(getDesign().facetGroups, connection?.profile, connection?.language);
    facetView.render(page.facets, active.filters, displayedFacetGroups);
    facetHint.hidden = Boolean(facetFields.childElementCount);
  }

  function promotionLabel() {
    const label = document.createElement('span');
    label.className = 'search-promotion-marker';
    label.textContent = getDesign().promotionBadge;
    return label;
  }

  function renderResults(page: BuildPage, active: BuildSearch, language?: string) {
    renderPromotionBanners(promotions, page.externalPromotions, getDesign().promotionHeading, language);
    placePromotionBanners(promotions, layout, getDesign().bannerPlacement);
    sort.replaceChildren(new Option('Relevance', ''), ...page.sorts.map(item => new Option(item.label, item.value)));
    emitSortOptions(page.sorts);
    sort.value = page.sorts.some(item => item.value === active.sort) ? active.sort : '';
    renderFacets(page, active);
    const append = paginationMode() === 'loadMore' && active.start > 0 && grid.childElementCount > 0;
    const rendered = page.cards.map(card => {
      const result = document.createElement('article');
      result.className = 'searchstax-search-result';
      if (language) result.lang = language;
      if (card.promoted) result.append(promotionLabel());
      appendResultCard(result, card, getDesign().cardMetadata);
      return result;
    });
    if (append) grid.append(...rendered);
    else grid.replaceChildren(...rendered);
    resultWindow = { total: page.total, start: append ? 0 : active.start, visible: grid.childElementCount, query: active.query };
    grid.hidden = grid.childElementCount === 0;
    empty.hidden = grid.childElementCount > 0;
    empty.textContent = resultMappingNotice(page.mappingsKnown, page.cards.length, page.total) || getDesign().noResultsText;
    if (settingsSummary && connection && !get('[data-single-experience]').hidden) {
      settingsSummary.textContent = profileStatus(connection.configuration?.entitlements ?? {}, connection.settings, page.highlighting, connection);
    }

    const focusedPageButton = document.activeElement;
    const focusedLoadMore = focusedPageButton === loadMore;
    const loaded = append ? grid.childElementCount : page.resultCount;
    const pageRange = (append ? 1 : active.start + 1) + '–' + (append ? loaded : active.start + page.resultCount) + ' of ' + page.total + ' results';
    const moreAvailable = active.start + page.resultCount < page.total;
    const loadingMore = paginationMode() === 'loadMore';
    loadMore.hidden = !loadingMore || !moreAvailable;
    updateVisibility();
    for (const { range, previous, next } of pagers) {
      range.textContent = loadingMore && !moreAvailable && append ? 'All ' + page.total + ' results loaded' : pageRange;
      previous.hidden = loadingMore || active.start === 0;
      next.hidden = loadingMore || !moreAvailable;
      if ((focusedPageButton === previous && previous.hidden) || (focusedPageButton === next && next.hidden)) range.focus();
    }
    if (focusedLoadMore) (loadMore.hidden ? bottomPager.range : loadMore).focus({ preventScroll: true });
  }

  async function load(candidate: CustomerConnection, search: BuildSearch, connecting = false) {
    request?.abort();
    const pending = new AbortController();
    request = pending;
    failedSearch = null;
    if (connecting) connect.textContent = 'Connect';
    else recovery.begin(place, trigger);
    const feedback = connecting ? formStatus : searchFeedback;
    delete feedback.dataset.tone;
    feedback.textContent = connecting ? 'Connecting to your Search App…' : 'Searching your app…';
    if (connecting) {
      connect.setAttribute('aria-disabled', 'true');
      if (form.contains(document.activeElement)) {
        connect.focus({ preventScroll: true });
        connect.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    } else {
      options = search;
      lastStartingSort = getDesign().startingSort;
      previousResults.hidden = !status.textContent;
      empty.hidden = true;
      panel.setAttribute('data-searching', '');
      layout.setAttribute('aria-busy', 'true');
    }
    const timer = window.setTimeout(() => pending.abort(), 12000);
    try {
      const page = await searchBuildApp(candidate, search, pending.signal, connecting ? [] : latestPage?.sorts);
      if (request !== pending) return;
      search = { ...search, sort: page.sort, start: page.start };
      if (connecting && candidate.configuration) {
        candidate = { ...candidate, settings: page.settings, language: page.settings?.language ?? page.language ?? '', profile: page.settings?.profile ?? candidate.profile };
      }
      connection = candidate;
      options = search;
      latestPage = page;
      if (connecting) {
        snapshot.value = '';
        discoveryKey.value = '';
        clearFormToken();
        suggestionSource = candidate.suggestEndpoint ? createCustomerSuggestionSource(candidate, candidate.suggestEndpoint) : null;
        form.hidden = true;
        panel.hidden = false;
        formStatus.textContent = 'Connected to your Search App.';
        source.textContent = [new URL(candidate.endpoint).hostname, candidate.profile || 'Default profile', candidate.language || 'App default language'].join(' · ');
        onModeChange(search.query);
        if (!get('[data-single-experience]').hidden) showAnswers(candidate, search.query);
      }
      recovery.clear();
      displayedStart = search.start;
      searchFeedback.textContent = '';
      renderResults(page, search, contentLanguageTag(candidate.language));
      onResultSettings();
      const rows = getDesign().resultsPerPage;
      const configuredSort = getDesign().showSorting ? getDesign().startingSort : '';
      const currentSort = page.sorts.some(item => item.value === configuredSort) ? configuredSort : '';
      if (connecting && (rows !== search.rows || currentSort !== search.sort)) run({ rows, sort: currentSort });
    } catch (error) {
      if (request !== pending) return;
      const message = pending.signal.aborted ? 'The Search App took too long to respond. Try again.'
        : error instanceof CustomerSearchError ? error.message
        : 'Couldn’t reach the Search App. Check the Select endpoint and whether it allows this browser origin.';
      if (connecting) {
        if (error instanceof CustomerSearchTokenError && token.value.trim() === candidate.token) {
          clearFormToken();
          fieldError(token, message);
        } else {
          feedback.dataset.tone = 'error';
          feedback.textContent = message;
          connect.textContent = 'Retry connection';
          if (document.activeElement === connect) feedback.scrollIntoView({ block: 'nearest', behavior: 'instant' });
        }
      } else {
        failedSearch = search;
        feedback.textContent = '';
        recovery.error(message);
      }
    } finally {
      window.clearTimeout(timer);
      if (request === pending) {
        request = null;
        connect.removeAttribute('aria-disabled');
        panel.removeAttribute('data-searching');
        layout.setAttribute('aria-busy', 'false');
        previousResults.hidden = !failedSearch || !latestPage;
      }
    }
  }

  function run(changes: Partial<BuildSearch>, anchor: HTMLElement = searchForm, control: HTMLElement = queryInput) {
    if (!connection || !options) return;
    place = anchor;
    trigger = control;
    void load(connection, { ...options, facetMode: getDesign().facetMode, start: 0, ...changes });
  }

  function showAnswers(app: CustomerConnection, term: string) {
    if (term && app.answerEndpoint && featureStatus(app.configuration?.entitlements.smartAnswers, app.settings?.smartAnswers) === 'On') void answers.start(app, term);
    else answers.clear();
  }

  function disconnect() {
    const wasConnected = Boolean(connection);
    request?.abort();
    request = null;
    answers.clear();
    recovery.clear();
    clearFieldError();
    connect.textContent = 'Connect';
    failedSearch = null;
    connection = null;
    importVersion++;
    suggestionSource = null;
    options = null;
    latestPage = null;
    resultWindow = undefined;
    panel.hidden = true;
    panel.removeAttribute('data-searching');
    layout.setAttribute('aria-busy', 'false');
    previousResults.hidden = true;
    searchFeedback.textContent = '';
    grid.hidden = true;
    grid.replaceChildren();
    promotions.replaceChildren();
    promotions.hidden = true;
    facetView.reset();
    sort.replaceChildren();
    emitSortOptions([]);
    status.textContent = '';
    source.textContent = '';
    formStatus.textContent = '';
    form.reset();
    connectionOptions.open = false;
    clearFormToken();
    form.hidden = false;
    connect.removeAttribute('aria-disabled');
    if (wasConnected) onModeChange(null);
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (connect.getAttribute('aria-disabled') === 'true') return;
    clearFieldError();
    const selectEndpoint = readCustomerEndpoint(endpoint.value);
    if (!selectEndpoint) {
      fieldError(endpoint, 'Enter the HTTPS SearchStax Select endpoint ending in /emselect.');
      return;
    }
    const key = token.value.trim();
    const query = testQuery.value.trim();
    if (!key || /[\r\n\t ]/.test(key) || !query) {
      fieldError((!key || /[\r\n\t ]/.test(key) ? token : testQuery), 'Enter a read-only token and a test search.');
      return;
    }
    const requestedAnswerEndpoint = answerEndpoint.value.trim();
    const requestedSuggestEndpoint = suggestEndpoint.value.trim();
    const autoSuggestEndpoint = requestedSuggestEndpoint ? readCustomerEndpoint(requestedSuggestEndpoint, 'emsuggest') : null;
    const streamingEndpoint = requestedAnswerEndpoint ? readAnswerEndpoint(requestedAnswerEndpoint) : null;
    const profileName = profile.value.trim();
    if (requestedAnswerEndpoint && !streamingEndpoint) {
      fieldError(answerEndpoint, 'Enter the HTTPS SearchStax streaming Answer endpoint ending in /answer.');
      return;
    }
    if (requestedSuggestEndpoint && !autoSuggestEndpoint) {
      fieldError(suggestEndpoint, 'Enter the HTTPS SearchStax Auto-Suggest endpoint ending in /emsuggest.');
      return;
    }
    const relatedURL = readCustomerEndpoint(relatedEndpoint.value, 'related-search');
    const discovery = discoveryKey.value.trim();
    if ((relatedEndpoint.value.trim() || discovery) && (!relatedURL || !discovery)) {
      fieldError((relatedURL ? discoveryKey : relatedEndpoint), 'Enter both the HTTPS Related Searches endpoint ending in /related-search/ and its Discovery key.');
      return;
    }
    let configuration: AppConfiguration | undefined;
    let settings: Profile | undefined;
    const file = snapshot.files?.[0];
    const version = ++importVersion;
    if (file) {
      try {
        configuration = readAppConfiguration(await file.text(), selectEndpoint);
        if (version !== importVersion) return;
        const requestedLanguage = language.value.trim().toLowerCase().replaceAll('-', '_');
        if (profileName) {
          const matches = configuration.profiles.filter(item => item.profile === profileName && (!requestedLanguage || item.language === requestedLanguage));
          if (matches.length !== 1) throw Error('Enter a profile and language listed together in this snapshot, or leave the profile blank to use the app default.');
          settings = matches[0];
        }
      } catch (error) {
        if (version === importVersion) fieldError(snapshot, error instanceof Error ? error.message : 'Check the configuration snapshot.');
        return;
      }
    }
    tokenDestinations = endpointFields.map(field => field.value.trim());
    void load({
      endpoint: selectEndpoint, token: key, configuration, settings, profile: settings?.profile ?? profileName, language: settings?.language ?? language.value.trim(),
      relatedURL: relatedURL ?? undefined, discoveryKey: discovery || undefined,
      answerEndpoint: streamingEndpoint ?? undefined, suggestEndpoint: autoSuggestEndpoint ?? undefined,
    },
      { query, start: 0, rows: getDesign().resultsPerPage, sort: getDesign().showSorting ? getDesign().startingSort : '', filters: new Map(), facetMode: getDesign().facetMode }, true);
  });
  connect.disabled = false;
  get('[data-customer-disconnect]').addEventListener('click', disconnect);
  sort.addEventListener('change', () => run({ sort: sort.value }, sortField, sort));
  for (const { element, previous, next } of pagers) {
    previous.addEventListener('click', () => {
      if (options && !request) run({ start: Math.max(0, displayedStart - options.rows) }, element, previous);
    });
    next.addEventListener('click', () => {
      if (options && !request) run({ start: displayedStart + options.rows }, element, next);
    });
  }
  loadMore.addEventListener('click', () => {
    if (!connection || !options || !latestPage || request) return;
    run({ start: displayedStart + latestPage.resultCount }, pager, loadMore);
  });

  return {
    get connection() { return connection; },
    get query() { return options?.query; },
    get highlighting() { return latestPage?.highlighting; },
    get order() { return options?.sort; },
    get facetGroupContext() {
      return { scope: facetGroupScope(connection?.profile, connection?.language), groups: latestPage?.facets ?? [] };
    },
    showAnswers,
    setAnswerAppearance: answers.setAppearance,
    suspendAnswers: answers.clear,
    resumeAnswers() {
      if (connection && options?.query) showAnswers(connection, options.query);
    },
    get experiences() { return connection?.configuration?.profiles ?? []; },
    get discovery() {
      return connection?.relatedURL && connection.discoveryKey && featureStatus(connection.configuration?.entitlements.relatedSearches, connection.settings?.relatedSearches) === 'On'
        ? { url: connection.relatedURL, key: connection.discoveryKey, language: connection.language } : null;
    },
    get active() { return Boolean(connection); },
    get suggestionSource() { return suggestionSource; },
    disconnect,
    search(query: string) {
      const term = query.trim();
      if (!term) {
        queryInput.setCustomValidity('Enter a search term for your site.');
        queryInput.reportValidity();
        queryInput.setCustomValidity('');
        return;
      }
      facetView.reset();
      run({ query: term, filters: new Map() });
      if (connection) showAnswers(connection, term);
    },
    updateDesign(order?: string) {
      if (!connection || !options) return;
      updateVisibility();
      const design = getDesign();
      const previousMode = activePaginationMode;
      const nextMode = design.paginationMode;
      activePaginationMode = nextMode;
      loadMore.textContent = design.loadMoreText;
      placePromotionBanners(promotions, layout, design.bannerPlacement);
      updatePromotionLabels(panel, design);
      const groups = selectedFacetGroups(design.facetGroups, connection.profile, connection.language);
      if (latestPage && groups !== displayedFacetGroups) renderFacets(latestPage, options);
      else facetView.refresh();
      const startingSortChanged = design.startingSort !== lastStartingSort;
      const sortingReenabled = !lastShowSorting && design.showSorting;
      const nextOrder = design.showSorting ? (order ?? (startingSortChanged || sortingReenabled ? design.startingSort : options.sort)) : '';
      if (startingSortChanged) lastStartingSort = design.startingSort;
      lastShowSorting = design.showSorting;
      const clearSelection = !design.filters || options.facetMode !== design.facetMode;
      const filters = clearSelection ? new Map() : visibleFacetFilters(options.filters, groups);
      if (design.resultsPerPage !== options.rows || previousMode !== nextMode || filters.size !== options.filters.size ||
        options.facetMode !== design.facetMode || nextOrder !== options.sort) {
        run({
          rows: design.resultsPerPage,
          filters,
          sort: nextOrder,
        });
      }
    },
  };
}
