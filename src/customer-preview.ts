import { createSearchRecovery } from './search-recovery';
import { readAppConfiguration, featureStatus, profileStatus, type Profile, type AppConfiguration } from './app-configuration.js';
import { appendResultCard } from './result-card.js';
import type { DesignSettings } from './design';
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
  type CustomerSearch,
} from './customer-search';

export function setupCustomerPreview(
  root: Element,
  getDesign: () => DesignSettings,
  onModeChange: (query: string | null) => void,
) {
  const get = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const form = get<HTMLFormElement>('[data-customer-connect]');
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
  const searchFeedback = get('[data-customer-search-feedback]');
  const previousResults = get('[data-customer-previous-results]');
  const layout = get('[data-customer-layout]');
  const facets = get('[data-customer-facets]');
  const facetFields = get('[data-customer-facet-fields]');
  const facetHint = get('[data-customer-facet-hint]');
  const sort = get<HTMLSelectElement>('#lab-customer-sort');
  const sortField = get('[data-customer-sort-field]');
  const sortHint = get('[data-customer-sort-hint]');
  const promotions = get('[data-customer-promotions]');
  const grid = get('[data-customer-grid]');
  const empty = get('[data-customer-empty]');
  const pager = get('[data-customer-pager]');
  const range = get('[data-customer-range]');
  const previous = get<HTMLButtonElement>('[data-customer-prev]');
  const next = get<HTMLButtonElement>('[data-customer-next]');
  const searchForm = get<HTMLFormElement>('[data-lab-search-form]');
  const queryInput = get<HTMLInputElement>('#lab-query');
  let place: HTMLElement = searchForm;
  let trigger: HTMLElement = queryInput;
  let displayedStart = 0;
  let failedSearch: CustomerSearch | null = null;
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
  let options: CustomerSearch | null = null;
  let latestPage: BuildPage | null = null;
  let request: AbortController | null = null;
  let tokenDestinations: string[] | null = null;

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
    facets.hidden = !design.filters;
    layout.dataset.filters = design.filters ? 'on' : 'off';
    sortField.hidden = !design.showSorting || !latestPage?.sorts.length;
    sortHint.hidden = !design.showSorting || Boolean(latestPage?.sorts.length);
    if (latestPage?.mappingsKnown && latestPage.total === 0) empty.textContent = design.noResultsText;
  }

  function renderFacets(page: BuildPage, active: CustomerSearch) {
    const focused = document.activeElement as HTMLInputElement | HTMLSelectElement | null;
    const design = getDesign();
    const showChoices = design.filterPlacement === 'top';
    facetFields.dataset.showChoices = String(showChoices);
    const fields = page.facets.filter(facet => facet.choices.length || active.filters.has(facet.field));
    facetHint.hidden = fields.length > 0;
    facetFields.replaceChildren(...fields.map(facet => {
      const label = document.createElement('label');
      label.className = 'search-lab__field search-lab__customer-facet';
      const select = document.createElement('select');
      select.dataset.customerFacet = facet.field;
      select.add(new Option('All', ''));
      for (const { value, count } of facet.choices) select.add(new Option(value + ' (' + count + ')', value));
      const selected = active.filters.get(facet.field);
      if (selected && !facet.choices.some(choice => choice.value === selected)) select.add(new Option(selected, selected));
      select.value = selected ?? '';
      if (showChoices) {
        const group = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = facet.label;
        const choices = document.createElement('div');
        choices.className = 'search-facet-choices';
        for (const option of select.options) {
          const choice = document.createElement('label');
          const radio = document.createElement('input');
          radio.type = 'radio';
          radio.name = 'customer-facet-' + facet.field;
          radio.dataset.customerFacet = facet.field;
          radio.value = option.value;
          radio.checked = option.selected;
          choice.append(radio, option.text);
          choices.append(choice);
        }
        group.append(legend, choices);
        return group;
      }
      label.append(facet.label, select);
      return label;
    }));
    if (focused?.dataset.customerFacet) {
      const controls = [...facetFields.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-customer-facet]')];
      controls.find(field => field.dataset.customerFacet === focused.dataset.customerFacet &&
        (field instanceof HTMLSelectElement || field.value === focused.value))?.focus();
    }
  }

  function promotionLabel() {
    const label = document.createElement('span');
    label.className = 'search-promotion-marker';
    label.textContent = 'Promoted';
    return label;
  }

  function renderExternalPromotions(entries: BuildPage['externalPromotions'], language?: string) {
    promotions.replaceChildren(...entries.map(entry => {
      const banner = document.createElement('div');
      banner.className = 'search-promotion-banner';
      const link = document.createElement('a');
      link.href = entry.url;
      link.textContent = entry.title;
      if (language) link.lang = language;
      link.referrerPolicy = 'no-referrer';
      banner.append(promotionLabel(), link);
      if (entry.description) {
        const description = document.createElement('p');
        description.textContent = entry.description;
        if (language) description.lang = language;
        banner.append(description);
      }
      return banner;
    }));
    promotions.hidden = !entries.length;
  }

  function renderResults(page: BuildPage, active: CustomerSearch, language?: string) {
    status.textContent = page.total + (page.total === 1 ? ' result' : ' results') + ' for “' + active.query + '”';
    renderExternalPromotions(page.externalPromotions, language);
    sort.replaceChildren(new Option('Relevance', ''), ...page.sorts.map(item => new Option(item.label, item.value)));
    sort.value = page.sorts.some(item => item.value === active.sort) ? active.sort : '';
    renderFacets(page, active);
    grid.replaceChildren(...page.cards.map(card => {
      const result = document.createElement('article');
      result.className = 'searchstax-search-result';
      if (language) result.lang = language;
      if (card.promoted) result.append(promotionLabel());
      appendResultCard(result, card);
      return result;
    }));
    grid.hidden = !page.cards.length;
    empty.hidden = Boolean(page.cards.length);
    empty.textContent = !page.mappingsKnown ? 'Results Fields are unknown for this profile.'
      : page.total ? 'No configured Results Fields have a displayable value on this page.' : getDesign().noResultsText;
    if (connection && !get('[data-single-experience]').hidden) {
      get('[data-app-settings-summary]').textContent = profileStatus(connection.configuration?.entitlements ?? {}, connection.settings, page.highlighting, connection);
    }

    const focusedPageButton = document.activeElement;
    pager.hidden = !page.resultCount;
    range.textContent = (active.start + 1) + '–' + (active.start + page.resultCount) + ' of ' + page.total + ' results';
    previous.hidden = active.start === 0;
    next.hidden = active.start + active.rows >= page.total;
    if ((focusedPageButton === previous && previous.hidden) || (focusedPageButton === next && next.hidden)) range.focus();
    updateVisibility();
  }

  async function load(candidate: CustomerConnection, search: CustomerSearch, connecting = false) {
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
      previousResults.hidden = !status.textContent;
      empty.hidden = true;
      panel.setAttribute('data-searching', '');
      layout.setAttribute('aria-busy', 'true');
    }
    const timer = window.setTimeout(() => pending.abort(), 12000);
    try {
      const page = await searchBuildApp(candidate, search, pending.signal);
      if (request !== pending) return;
      if (connecting && page.settings) candidate = { ...candidate, settings: page.settings, language: page.settings.language, profile: page.settings.profile };
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
      const rows = getDesign().resultsPerPage;
      if (connecting && rows !== search.rows) run({ rows });
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

  function run(changes: Partial<CustomerSearch>, anchor: HTMLElement = searchForm, control: HTMLElement = queryInput) {
    if (!connection || !options) return;
    place = anchor;
    trigger = control;
    void load(connection, { ...options, start: 0, ...changes });
  }

  function showAnswers(app: CustomerConnection, term: string) {
    if (featureStatus(app.configuration?.entitlements.smartAnswers, app.settings?.smartAnswers) === 'On') void answers.start(app, term);
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
    panel.hidden = true;
    panel.removeAttribute('data-searching');
    layout.setAttribute('aria-busy', 'false');
    previousResults.hidden = true;
    searchFeedback.textContent = '';
    grid.hidden = true;
    grid.replaceChildren();
    renderExternalPromotions([]);
    facetFields.replaceChildren();
    sort.replaceChildren();
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
      { query, start: 0, rows: getDesign().resultsPerPage, sort: '', filters: new Map() }, true);
  });
  connect.disabled = false;
  get('[data-customer-disconnect]').addEventListener('click', disconnect);
  sort.addEventListener('change', () => run({ sort: sort.value }, sortField, sort));
  facetFields.addEventListener('change', event => {
    const select = event.target;
    if (!(select instanceof HTMLSelectElement || select instanceof HTMLInputElement) || !select.dataset.customerFacet) return;
    const filters = new Map(options?.filters);
    if (select.value) filters.set(select.dataset.customerFacet, select.value);
    else filters.delete(select.dataset.customerFacet);
    run({ filters }, select.closest('label')!, select);
  });
  previous.addEventListener('click', () => {
    if (options && !request) run({ start: Math.max(0, displayedStart - options.rows) }, pager, previous);
  });
  next.addEventListener('click', () => {
    if (options && !request) run({ start: displayedStart + options.rows }, pager, next);
  });

  return {
    get connection() { return connection; },
    get query() { return options?.query; },
    get highlighting() { return latestPage?.highlighting; },
    get order() { return options?.sort; },
    suspendAnswers: answers.clear,
    resumeAnswers() {
      if (connection && options?.query) showAnswers(connection, options.query);
    },
    get experiences() { return connection?.configuration?.profiles ?? []; },
    get discovery() {
      return connection?.relatedURL && connection.discoveryKey && featureStatus(connection.configuration?.entitlements.relatedSearches, connection.settings?.relatedSearches) === 'On'
        ? { url: connection.relatedURL, key: connection.discoveryKey, language: connection.language, profile: connection.profile } : null;
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
      run({ query: term, filters: new Map() });
      if (connection) showAnswers(connection, term);
    },
    updateDesign(order?: string) {
      if (!connection || !options) return;
      updateVisibility();
      const design = getDesign();
      const showChoices = design.filterPlacement === 'top';
      if (latestPage && facetFields.dataset.showChoices !== String(showChoices)) renderFacets(latestPage, options);
      const nextOrder = design.showSorting ? (order ?? options.sort) : '';
      if (design.resultsPerPage !== options.rows || (!design.filters && options.filters.size) || nextOrder !== options.sort) {
        run({
          rows: design.resultsPerPage,
          filters: design.filters ? options.filters : new Map(),
          sort: nextOrder,
        });
      }
    },
  };
}
