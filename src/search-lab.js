import {
  DEFAULT_DESIGN,
  PAGE_SIZES,
  designVariables,
  isHexColor,
  isFont,
  isLayout,
  isResultSpacing,
  readDesignParams,
  readCorners,
  readLogoURL,
  readPageSize,
  readSamplePromotions,
  resolveSearchText,
  writeDesignParams,
} from './design';
import { createAngularStarterZip, createReactStarterZip, createStarterZip, createVueStarterZip, renderStarterCSS } from './starter';
import { tryCopyText } from './copy-checklist-request';
import { setupLabNavigation } from './navigation';
import { demoThumbnails } from './demo-thumbnails';
import { demoSortOptions } from './demo-sorting';
import { sampleSuggestionSource, setupSearchSuggestions } from './sample-suggestions';
import './sample-suggestions.css';
import {
  applySampleIndexedPromotion,
  createSampleExternalPromotion,
  samplePromotionMode,
  samplePromotionQuery,
  updateSampleExternalPromotion,
} from './sample-promotions';
import './sample-promotions.css';
import smartAnswersSampleHTML from './smart-answers-sample.html?raw';
import './smart-answers-sample.css';
import { setupRelatedSearches, relatedSource, demoRelatedSource } from './related-searches.js';
import './related-searches.css';
import profileControls from './profile-controls.html?raw';
import { resultCards, appendResultCard } from './result-card';
import { profileStatus, featureStatus } from './app-configuration';
import { demoProfiles, setupExperiencePreview } from './profile-experiences';
import { createSearchRecovery } from './search-recovery';
import { setupCustomerPreview } from './customer-preview';
import { setupDataFilters } from './demo-filter-comparison';
import { setupImprovePreview } from './improve-preview';
import { demoResultText, demoResultTitle } from './demo-content.js';
import { setupRelevanceComparison } from './relevance-comparison';
import { setupPaginationFocus } from './pagination-focus.js';

(function () {
  'use strict';

  var root = document.querySelector('[data-search-lab]');
  if (!root) return;

  var SCENARIOS = {
    fields: {
      query: 'travel vaccinations',
      name: 'SEARCH FIELDS',
      intro: 'See how Search Fields can help a page match a search.',
      copy: 'The fictional International Health page is already indexed. Its service-name field contains “Travel Vaccinations”.',
      before: 'Before: the service-name field isn’t included in Search Fields.',
      after: 'After: the service-name field is included in Search Fields.',
      note: 'The same query runs against a prepared demo profile. Adding a field can make a page eligible to match; it doesn’t guarantee its position.',
      doc: 'https://support.searchstax.com/hc/en-us/articles/40483375841421-Search-Fields',
      docLabel: 'Learn about Search Fields',
      video: 'https://support.searchstax.com/hc/en-us/articles/50357414946317-Search-Fields-Video',
      videoLabel: 'Watch the Search Fields video',
    },
    ranking: {
      query: 'campus flu clinic',
      name: 'RANKING',
      intro: 'See what happens when matches in page titles count more.',
      copy: 'Choose a search to compare its top five results. Switch between Before and After to explore either profile in Live Preview.',
      before: 'The Before profile uses the default weight for title matches.',
      after: 'The After profile applies a 1.5 Search Field boost to title matches.',
      note: 'A boost can move several pages. The order depends on which fields match and how closely they match.',
      doc: 'https://support.searchstax.com/hc/en-us/articles/40151648011149-Ranking',
      docLabel: 'Follow the Ranking setup steps',
      video: 'https://support.searchstax.com/hc/en-us/articles/50357479982989-Give-Selected-Search-Fields-More-Influence-Video',
      videoLabel: 'Watch the Search Field Boosts video',
    },
  };
  var FACET_LABELS = {
    community: 'Community', hub: 'Overview pages', location: 'Locations', news: 'News',
    program: 'Education programs', provider: 'Providers', research: 'Research',
    resource: 'Resources', service: 'Services',
  };
  var form = root.querySelector('[data-lab-search-form]');
  var queryInput = root.querySelector('#lab-query');
  var queryLabel = form.querySelector('label[for="lab-query"]');
  var submitButton = form.querySelector('button[type="submit"]');
  var textInputs = {
    searchFieldText: root.querySelector('#lab-field-text'),
    searchButtonText: root.querySelector('#lab-button-text'),
    noResultsText: root.querySelector('#lab-no-results-text'),
  };
  var filterToggle = root.querySelector('#lab-filters');
  var descriptionToggle = root.querySelector('#lab-descriptions');
  var thumbnailToggle = root.querySelector('#lab-thumbnails');
  var sortingToggle = root.querySelector('#lab-sorting');
  var suggestionsToggle = root.querySelector('#lab-suggestions');
  var smartAnswersSampleToggle = root.querySelector('#lab-smart-answers-sample');
  var answerSampleHost = root.querySelector('[data-lab-answer-sample]');
  answerSampleHost.innerHTML = smartAnswersSampleHTML;
  var answerSample = answerSampleHost.querySelector('details');
  var promotionsInput = root.querySelector('#lab-sample-promotions');
  var setSuggestionSource = setupSearchSuggestions(form, 'lab-search-suggestions');
  var sortOrder = root.querySelector('#lab-sort-order');
  var colorInput = root.querySelector('#lab-accent');
  var backgroundInput = root.querySelector('#lab-background');
  var cornersInput = root.querySelector('#lab-corners');
  var logoInput = root.querySelector('#lab-logo-url');
  var logo = root.querySelector('[data-lab-preview-logo]');
  var logoStatus = root.querySelector('[data-lab-logo-status]');
  var logoTimer;
  var dividerToggle = root.querySelector('#lab-dividers');
  var underlineToggle = root.querySelector('#lab-underline');
  var designSurface = root.querySelector('#lab-preview .search-lab__site');
  var fontInput = root.querySelector('#lab-font');
  var spacingInput = root.querySelector('#lab-spacing');
  var pageSizeInput = root.querySelector('#lab-page-size');
  var scenarioInput = root.querySelector('#lab-scenario');
  var facetsPanel = root.querySelector('[data-lab-facets-panel]');
  var facets = root.querySelector('#lab-facets');
  var resultsLayout = root.querySelector('[data-lab-results-layout]');
  var externalPromotion = createSampleExternalPromotion();
  resultsLayout.before(externalPromotion);
  var resultsContent = root.querySelector('[data-lab-results-content]');
  var previousResults = root.querySelector('[data-lab-previous-results]');
  var noResultsMessage = root.querySelector('[data-lab-no-results]');
  var pagination = root.querySelector('#lab-pagination');
  setupPaginationFocus(pagination.parentElement, function () { return search; });
  var status = root.querySelector('[data-lab-status]');
  var previewBrand = root.querySelector('[data-lab-preview-brand]');
  var demoOutput = root.querySelector('[data-lab-demo-output]');
  var demoAnchor = form;
  var demoControl = queryInput;
  var demoRecovery = createSearchRecovery(queryInput, function () {
    const current = search?.dataLayer.searchObject;
    if (current && !customerPreview.active) runSearch(current.query, false, true, current);
  });
  function chooseDemoAnchor(control) {
    demoControl = control instanceof HTMLElement ? control : queryInput;
    if (workspaceMode === 'examples' && !demoOutput.contains(demoControl) && !form.contains(demoControl)) {
      demoAnchor = form;
      return;
    }
    demoAnchor = demoControl.closest('[data-pagination-focus], .search-lab__facet-option, .search-lab__sort, .search-lab__comparison, .search-lab__sample, .search-lab__actions, .search-lab__scenario') || form;
  }
  for (const event of ['click', 'change', 'submit']) {
    root.addEventListener(event, function (e) {
      if (demoOutput.contains(e.target) || form.contains(e.target) || demoSearchButtons.includes(e.target) || e.target === scenarioInput) {
        if (!e.target.closest('.search-recovery')) chooseDemoAnchor(e.target === form ? queryInput : e.target);
      }
    }, true);
  }
  var fictionalElements = root.querySelectorAll('[data-lab-fictional-only]');
  var summary = root.querySelector('[data-lab-summary]');
  var feedback = root.querySelector('[data-lab-feedback]');
  var shareFields = root.querySelectorAll('.search-lab__share-url');
  var cssFeedback = root.querySelector('[data-lab-css-feedback]');
  var codeFeedback = root.querySelector('[data-lab-code-feedback]');
  var designFeedback = root.querySelector('[data-lab-design-feedback]');
  var resetButton = root.querySelector('[data-lab-reset]');
  var undoResetButton = root.querySelector('[data-lab-undo-reset]');
  var explanation = root.querySelector('[data-lab-explanation]');
  var profileLabel = root.querySelector('[data-lab-profile-label]');
  var facetEmpty = root.querySelector('[data-lab-facet-empty]');
  var phaseButtons = Array.prototype.slice.call(root.querySelectorAll('[data-lab-phase]'));
  var sampleButton = root.querySelector('[data-lab-sample]');
  var rankingButtons = Array.from(root.querySelectorAll('[data-lab-ranking-query]'));
  var suggestionDemoPending = false;
  var tryNoResults = root.querySelector('[data-lab-try-no-results]');
  var demoSearchButtons = [...phaseButtons, sampleButton, ...rankingButtons, tryNoResults];
  var config = {
    searchURL: root.getAttribute('data-search-url') || '',
    searchAuth: root.getAttribute('data-search-credential') || '',
    before: root.getAttribute('data-before-profile') || '',
    after: root.getAttribute('data-after-profile') || '',
    rankingAfter: root.getAttribute('data-ranking-profile') || '',
  };
  var demoConnection = {
    endpoint: config.searchURL, token: config.searchAuth, profile: config.before, language: 'en',
  };
  var showImprovePreview = setupImprovePreview(root, demoConnection, config.after, config.rankingAfter);
  var showDataFilters = setupDataFilters(root, demoConnection);
  var relevanceComparison = setupRelevanceComparison(root, demoConnection);
  var design = { ...DEFAULT_DESIGN };
  var designBeforeReset = null;
  var draftKey = 'search-lab:design:' + window.location.pathname + window.location.search;
  var state = { scenario: 'fields', phase: 'before', rankingPreset: '' };
  var workspaceMode;
  var designQuery = queryInput.defaultValue;
  var search;
  var expected;
  var completed = false;
  var noMatches = false;
  var hasPreviousResults = false;
  var requestTimer;
  var restoreFocus;
  var relatedToggle = root.querySelector('#lab-related-toggle');
  var relatedPlacement = root.querySelector('#lab-related-placement');
  var topFilterStyle = root.querySelector('#lab-top-filter-style');
  var filterPlacement = root.querySelector('#lab-filter-placement');
  var connectedRelatedSource;
  var relatedQuery = '';
  var related = setupRelatedSearches(form, function (term) {
    queryInput.value = term;
    queryInput.focus();
    form.requestSubmit();
  });
  function updateRelated() {
    if (root.dataset.labView !== 'design' || !experiencePanel.hidden) { related.clear(); return; }
    var connected = customerPreview.active;
    var anchor = connected ? root.querySelector('[data-customer-layout]') : resultsLayout;
    void related.show(anchor, connected && design.relatedPlacement === 'off' ? 'below' : design.relatedPlacement, relatedQuery, connected ? connectedRelatedSource : demoRelatedSource);
  }
  const experiencePanel = root.querySelector('#lab-experiences');
  experiencePanel.insertAdjacentHTML('afterbegin', profileControls.replace('<!-- smart-answer-sample -->', () => smartAnswersSampleHTML));
  const profileChoices = root.querySelector('[data-profile-choices]');
  const catalogStatus = root.querySelector('[data-profile-catalog-status]');
  const settingsSummary = root.querySelector('[data-app-settings-summary]');
  let availableProfiles = demoProfiles;
  let includedProfiles = [...demoProfiles];
  let choiceLanguage = demoProfiles[0].language;
  let selectedSettings;
  function showProfileSettings(profile, entitlements, summary) {
    selectedSettings = { profile, entitlements };
    settingsSummary.textContent = summary ?? profileStatus(entitlements, profile, customerPreview?.highlighting, customerPreview?.connection);
    settingsSummary.hidden = false;
    syncFeatureControls();
  }
  function syncFeatureControls() {
    const connected = Boolean(customerPreview?.active);
    const appDriven = connected || !experiencePanel.hidden;
    const configured = !appDriven || (selectedSettings && featureStatus(selectedSettings.entitlements.relatedSearches, selectedSettings.profile?.relatedSearches) === 'On');
    const relatedSection = relatedToggle.closest('details');
    relatedSection.hidden = !configured;
    relatedToggle.disabled = connected;
    relatedToggle.checked = connected ? Boolean(configured) : design.relatedPlacement !== 'off';
    relatedPlacement.closest('.search-lab__field').hidden = !configured || !relatedToggle.checked;
    root.querySelector('[data-placement-target="lab-related-placement"]').hidden = !configured || !relatedToggle.checked;
    if (connected && design.relatedPlacement === 'off') relatedPlacement.value = 'below';
    smartAnswersSampleToggle.closest('.search-lab__field').hidden = connected || (appDriven && !selectedSettings?.profile?.smartAnswers);
    thumbnailToggle.closest('.search-lab__field').hidden = appDriven;
    descriptionToggle.closest('.search-lab__field').hidden = connected;
  }
  experiencePanel.addEventListener('profile-settings', event => {
    if (experiencePanel.hidden) return;
    const { profile, entitlements, summary } = event.detail;
    if (choiceLanguage !== profile.language) {
      choiceLanguage = profile.language;
      refreshTabChoices();
    }
    showProfileSettings(profile, entitlements, summary);
  });
  function refreshTabChoices() {
    const choices = availableProfiles.filter(profile => profile.language === choiceLanguage);
    profileChoices.hidden = !design.profileTabs || !choices.length;
    profileChoices.querySelector('div').replaceChildren(...choices.map(profile => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = includedProfiles.includes(profile);
      checkbox.disabled = checkbox.checked && includedProfiles.length === 1;
      checkbox.addEventListener('change', () => {
        includedProfiles = availableProfiles.filter(item => item === profile ? checkbox.checked : includedProfiles.includes(item));
        experiencePreview.setProfiles(includedProfiles);
        refreshTabChoices();
        profileChoices.querySelectorAll('input')[choices.indexOf(profile)]?.focus();
      });
      label.append(checkbox, ' ' + profile.profile + ' (' + profile.language + ')');
      return label;
    }));
  }
  const experienceToggle = root.querySelector('#lab-profile-tabs');
  const languageToggle = root.querySelector('#lab-language-picker');
  const experiencePreview = setupExperiencePreview(experiencePanel, Object.fromEntries(Object.entries(demoThumbnails).map(([url, image]) => [url, image.source])));
  function updateExperienceMode(sourceQuery) {
    if (!availableProfiles.length) { design.profileTabs = false; design.languagePicker = false; }
    const enabled = (design.profileTabs || design.languagePicker) && root.dataset.labView === 'design';
    experienceToggle.disabled = availableProfiles.length === 0;
    languageToggle.disabled = !availableProfiles.length;
    experienceToggle.checked = design.profileTabs;
    profileChoices.hidden = !design.profileTabs || !profileChoices.querySelector('input');
    languageToggle.checked = design.languagePicker;
    experiencePreview.configure(design);
    if (enabled === !experiencePanel.hidden) return;
    experiencePanel.hidden = !enabled;
    root.querySelector('[data-single-experience]').hidden = enabled;
    if (enabled) {
      const submitted = sourceQuery ?? customerPreview.query ?? expected?.query ?? queryInput.value;
      customerPreview.suspendAnswers();
      experiencePreview.open(submitted, sourceQuery ?? queryInput.value);
    } else {
      experiencePreview.close();
      const connection = customerPreview.connection;
      if (connection) showProfileSettings(connection.settings, connection.configuration?.entitlements ?? {});
      else { selectedSettings = null; settingsSummary.hidden = true; }
    }
  }
  function changeNavigation() {
    const previous = experiencePanel.hidden ? null : experiencePreview.searchState;
    design.profileTabs = experienceToggle.checked;
    design.languagePicker = languageToggle.checked;
    updateDesign();
    if (previous && experiencePanel.hidden) {
      if (customerPreview.active) {
        if (previous.query === customerPreview.query) customerPreview.resumeAnswers();
        else {
          relatedQuery = previous.query;
          updateRelated();
          customerPreview.search(previous.query);
        }
      } else if (previous.query !== expected?.query) {
        runSearch(previous.query, true);
      }
      queryInput.value = previous.draft;
    }
  }
  refreshTabChoices();
  experienceToggle.addEventListener('change', changeNavigation);
  languageToggle.addEventListener('change', changeNavigation);
  root.querySelector('[data-exp-disconnect]').addEventListener('click', () => customerPreview.disconnect());
  var customerPreview = setupCustomerPreview(root, function () { return design; }, function (query) {
    var connected = query !== null;
    if (connected) {
      window.clearTimeout(requestTimer);
      demoRecovery.clear();
      demoOutput.removeAttribute('data-searching');
      resultsLayout.setAttribute('aria-busy', 'false');
    }
    availableProfiles = connected ? customerPreview.experiences : demoProfiles;
    choiceLanguage = connected ? customerPreview.connection.language : demoProfiles[0].language;
    includedProfiles = [...availableProfiles];
    if (!availableProfiles.length) {
      design.profileTabs = false;
      design.languagePicker = false;
    }
    catalogStatus.textContent = connected && !customerPreview.connection.configuration ? 'Search Profiles are unknown. Connect with an app configuration snapshot to choose tabs.'
      : !availableProfiles.length ? 'This snapshot lists no Search Profiles.' : '';
    if (connected) showProfileSettings(customerPreview.connection.settings, customerPreview.connection.configuration?.entitlements ?? {});
    else { selectedSettings = null; settingsSummary.hidden = true; }
    refreshTabChoices();
    experiencePreview.setSource(customerPreview.connection, includedProfiles, query ?? sampleQuery(), customerPreview.connection?.settings);
    root.querySelector('[data-exp-disconnect]').hidden = !connected;
    updateExperienceMode(query ?? sampleQuery());
    var discovery = customerPreview.discovery;
    connectedRelatedSource = discovery ? relatedSource(discovery.url, discovery.key, discovery.language, discovery.profile) : null;
    relatedQuery = query || '';
    updateRelated();
    root.toggleAttribute('data-customer-connected', connected);
    root.toggleAttribute('data-hide-result-descriptions', !connected && !design.showDescriptions);
    previewBrand.hidden = !connected;
    demoOutput.hidden = connected;
    fictionalElements.forEach(function (element) { element.hidden = connected; });
    syncFeatureControls();
    updateFeatureSamples();
    updatePreviewText();
    if (root.dataset.labView !== 'design') return;
    queryInput.disabled = false;
    submitButton.disabled = false;
    queryInput.value = query ?? sampleQuery();
    (experiencePanel.hidden ? queryInput : experiencePanel.querySelector('input')).focus({ preventScroll: true });
    if (!connected) {
      if (search) runSearch(queryInput.value, true);
      else initialize();
    }
  });

  // The credential is for the public, read-only demo search only. Remove it
  // from the DOM and only include it in the runnable demo starter.
  root.removeAttribute('data-search-credential');
  sortOrder.replaceChildren(...demoSortOptions.map(({ label, order }) => new Option(label, order)));
  pageSizeInput.replaceChildren(...PAGE_SIZES.map(size => new Option(String(size), String(size))));

  function updatePreviewText() {
    var text = workspaceMode === 'examples' ? DEFAULT_DESIGN : design;
    var fieldText = customerPreview.active && text.searchFieldText === DEFAULT_DESIGN.searchFieldText
      ? 'Search your site' : text.searchFieldText;
    queryLabel.textContent = fieldText;
    queryInput.placeholder = fieldText;
    submitButton.textContent = text.searchButtonText;
    noResultsMessage.textContent = text.noResultsText;
  }

  function updateFeatureSamples() {
    answerSample.hidden = customerPreview.active || !design.showSmartAnswersSample;
    if (answerSample.hidden) answerSample.open = false;
    var source = customerPreview.active ? customerPreview.suggestionSource : (design.showSuggestions ? sampleSuggestionSource : null);
    setSuggestionSource(root.dataset.labView === 'design' && experiencePanel.hidden ? source : null);
  }

  function clearDesignFeedback() {
    cssFeedback.textContent = '';
    designBeforeReset = null;
    undoResetButton.hidden = true;
    designFeedback.textContent = '';
  }

  function updateDesign(connectedOrder) {
    updateExperienceMode();
    clearDesignFeedback();
    for (const [name, value] of Object.entries(designVariables(design))) designSurface.style.setProperty(name, value);
    root.setAttribute('data-layout', design.layout);
    root.toggleAttribute('data-hide-result-descriptions', !customerPreview.active && !design.showDescriptions);
    root.toggleAttribute('data-show-demo-thumbnails', design.showThumbnails);
    root.toggleAttribute('data-show-sorting', design.showSorting);
    designSurface.dataset.filterPlacement = design.filterPlacement;
    filterPlacement.value = design.filterPlacement;
    topFilterStyle.closest('[data-top-filter-options]').hidden = !design.filters || design.filterPlacement !== 'top';
    topFilterStyle.value = design.topFilterStyle;
    filterPlacement.closest('.search-lab__field').hidden = !design.filters;
    root.querySelector('[data-placement-target="lab-filter-placement"]').hidden = !design.filters;
    relatedToggle.checked = design.relatedPlacement !== 'off';
    relatedPlacement.closest('.search-lab__field').hidden = !relatedToggle.checked;
    root.querySelector('[data-placement-target="lab-related-placement"]').hidden = !relatedToggle.checked;
    if (relatedToggle.checked) relatedPlacement.value = design.relatedPlacement;
    updateRelated();
    designSurface.toggleAttribute('data-hide-list-dividers', !design.listDividers);
    designSurface.toggleAttribute('data-underline-titles', design.underlineTitles);
    resultsLayout.setAttribute('data-filters', design.filters ? 'on' : 'off');
    facetsPanel.hidden = !design.filters;
    filterToggle.checked = design.filters;
    descriptionToggle.checked = design.showDescriptions;
    thumbnailToggle.checked = design.showThumbnails;
    sortingToggle.checked = design.showSorting;
    suggestionsToggle.checked = design.showSuggestions;
    smartAnswersSampleToggle.checked = design.showSmartAnswersSample;
    promotionsInput.value = design.samplePromotions;
    sampleButton.textContent = sampleQuery();
    syncFeatureControls();
    updateFeatureSamples();
    if (!design.showSorting) sortOrder.value = '';
    colorInput.value = design.color;
    backgroundInput.value = design.background;
    cornersInput.value = design.corners;
    window.clearTimeout(logoTimer);
    logoInput.value = design.logoURL;
    logoInput.removeAttribute('aria-invalid');
    updateLogo();
    dividerToggle.checked = design.listDividers;
    dividerToggle.closest('[data-lab-list-option]').hidden = design.layout !== 'list';
    underlineToggle.checked = design.underlineTitles;
    fontInput.value = design.font;
    spacingInput.value = design.resultSpacing;
    pageSizeInput.value = String(design.resultsPerPage);
    Object.keys(textInputs).forEach(function (key) { textInputs[key].value = design[key]; });
    updatePreviewText();
    root.querySelector('input[name="lab-layout"][value="' + design.layout + '"]').checked = true;
    codeFeedback.textContent = '';
    if (experiencePanel.hidden) customerPreview.updateDesign(connectedOrder);
    saveDesignDraft();
  }

  function showLogoStatus(message) {
    logoStatus.textContent = message;
    logoStatus.hidden = !message;
  }

  function updateLogo() {
    if ((logo.getAttribute('src') ?? '') === design.logoURL) {
      showLogoStatus(design.logoURL && logo.complete && !logo.naturalWidth
        ? 'The logo couldn’t load. Check the image URL.' : '');
      return;
    }
    logo.hidden = true;
    showLogoStatus('');
    if (design.logoURL) logo.src = design.logoURL;
    else logo.removeAttribute('src');
  }

  function updatePhase() {
    clearStaleShareLinks();
    phaseButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-lab-phase') === state.phase));
    });
    profileLabel.textContent = state.phase === 'after' ? 'After' : 'Before';
    explanation.textContent = SCENARIOS[state.scenario][state.phase];
  }

  function updateScenario() {
    var scenario = SCENARIOS[state.scenario];
    var ranking = workspaceMode === 'examples' && state.scenario === 'ranking';
    scenarioInput.value = state.scenario;
    root.querySelector('[data-lab-lesson-intro]').textContent = scenario.intro;
    root.querySelector('[data-lab-lesson-name]').textContent = scenario.name;
    root.querySelector('[data-lab-lesson-copy]').textContent = scenario.copy;
    root.querySelector('[data-lab-lesson-note]').textContent = scenario.note;
    root.querySelector('[data-lab-comparison]').setAttribute('aria-label', (state.scenario === 'ranking' ? 'Ranking' : 'Search Fields') + ' comparison');
    sampleButton.textContent = sampleQuery();
    sampleButton.parentElement.hidden = ranking || customerPreview.active;
    root.querySelector('[data-lab-ranking-queries]').hidden = !ranking;
    root.querySelector('[data-lab-ranking-checklist]').hidden = !ranking;
    root.querySelector('[data-lab-doc]').href = scenario.doc;
    root.querySelector('[data-lab-doc-label]').textContent = scenario.docLabel;
    root.querySelector('[data-lab-video]').href = scenario.video;
    root.querySelector('[data-lab-video-label]').textContent = scenario.videoLabel;
    root.querySelector('[data-lab-field-checklist]').hidden = state.scenario !== 'fields';
    updatePhase();
  }

  function sampleQuery() {
    if (workspaceMode === 'examples') {
      return (state.scenario === 'ranking' && state.rankingPreset) || SCENARIOS[state.scenario].query;
    }
    return design.samplePromotions === 'off' ? designQuery : samplePromotionQuery;
  }

  function isRankingPreset(query) {
    return rankingButtons.some(function (button) { return button.dataset.labRankingQuery === query; });
  }

  function selectedPromotions(query) {
    return samplePromotionMode(query, workspaceMode === 'design' ? design.samplePromotions : 'off');
  }

  function showSearchProgress() {
    if (customerPreview.active || demoOutput.hasAttribute('data-searching')) return;
    demoOutput.setAttribute('data-searching', '');
    completed = false;
    demoRecovery.begin(demoAnchor.isConnected ? demoAnchor : form, demoControl);
    window.clearTimeout(requestTimer);
    requestTimer = window.setTimeout(showUnavailable, 15000);
    resultsLayout.setAttribute('aria-busy', 'true');
    status.removeAttribute('data-tone');
    status.textContent = 'Searching the demo…';
    previousResults.hidden = !hasPreviousResults;
    noResultsMessage.hidden = true;
  }

  function busy(value) {
    if (customerPreview.active) return;
    if (value && (document.activeElement === queryInput || document.activeElement === submitButton ||
      document.activeElement === scenarioInput || document.activeElement === sortOrder ||
      demoSearchButtons.includes(document.activeElement))) {
      restoreFocus = document.activeElement;
    }
    if (value) showSearchProgress();
    else {
      demoOutput.removeAttribute('data-searching');
      resultsLayout.setAttribute('aria-busy', 'false');
      previousResults.hidden = true;
    }
    // Retain the previous list while a new query loads, but keep its controls from resubmitting it.
    facets.inert = value;
    pagination.inert = value;
    submitButton.disabled = value;
    queryInput.disabled = value;
    scenarioInput.disabled = value;
    sortOrder.disabled = value || !search;
    demoSearchButtons.forEach(function (button) { button.disabled = value; });
    if (!value && suggestionDemoPending) showSuggestionDemo();
    if (!value && restoreFocus) {
      if (document.activeElement === document.body || document.activeElement === document.documentElement) {
        restoreFocus.focus({ preventScroll: true });
      }
      restoreFocus = null;
    }
  }

  function showUnavailable(message) {
    window.clearTimeout(requestTimer);
    if (customerPreview.active) return;
    busy(false);
    if (!search) {
      queryInput.disabled = true;
      submitButton.disabled = true;
      demoSearchButtons.forEach(function (button) { button.disabled = true; });
    }
    if (search && !message) {
      status.textContent = '';
      previousResults.hidden = !hasPreviousResults;
      demoRecovery.error('The demo search didn’t finish. Try again.');
    } else {
      status.dataset.tone = 'error';
      status.textContent = message || 'The live demo is unavailable right now. Please try again later.';
    }
    resultsContent.hidden = !hasPreviousResults;
    pagination.hidden = !hasPreviousResults;
    noResultsMessage.hidden = true;
  }

  function finishSearch() {
    if (customerPreview.active || !completed || !search || search.dataLayer.loading) return;
    window.clearTimeout(requestTimer);
    busy(false);
    demoRecovery.clear();
    resultsContent.hidden = false;
    hasPreviousResults = true;
    noResultsMessage.hidden = !noMatches;
    updateSampleExternalPromotion(externalPromotion, expected.promotions);
    pagination.hidden = false;
    status.textContent = '';
    facetEmpty.hidden = Boolean(facets.querySelector('input'));
  }

  function labelFacets() {
    facets.querySelectorAll('[data-lab-type]').forEach(function (label) {
      var value = label.getAttribute('data-lab-type');
      var text = FACET_LABELS[value] || value;
      if (label.textContent !== text) label.textContent = text;
    });
    facetEmpty.hidden = Boolean(facets.querySelector('input'));
  }

  function readSharedSettings() {
    var params = new URL(window.location.href).searchParams;
    var draft = null;
    if (window.performance.getEntriesByType('navigation')[0]?.type === 'reload') {
      try {
        draft = window.sessionStorage.getItem(draftKey);
      } catch { /* Use the link when the browser blocks storage. */ }
    }
    const settings = draft === null ? params : new URLSearchParams(draft);
    design = readDesignParams(settings);
    var scenario = params.get('lab_scenario');
    var phase = params.get('lab_view');
    var preset = params.get('lab_query');
    if (Object.prototype.hasOwnProperty.call(SCENARIOS, scenario)) state.scenario = scenario;
    if (phase === 'before' || phase === 'after') state.phase = phase;
    if (state.scenario === 'ranking' && isRankingPreset(preset)) state.rankingPreset = preset;
  }

  function saveDesignDraft() {
    clearStaleShareLinks();
    var params = new URLSearchParams();
    writeDesignParams(params, design);
    try {
      window.sessionStorage.setItem(draftKey, params.toString());
    } catch { /* The design stays available in the preview and copied links. */ }
  }

  function sharedURL() {
    var url = new URL(window.location.href);
    url.search = '';
    url.hash = workspaceMode === 'examples' ? 'lab-examples' : 'lab-design';
    writeDesignParams(url.searchParams, design);
    if (workspaceMode === 'examples') {
      url.searchParams.set('lab_scenario', state.scenario);
      url.searchParams.set('lab_view', state.phase);
      if (state.scenario === 'ranking' && isRankingPreset(expected?.query)) url.searchParams.set('lab_query', expected.query);
    }
    return url.href;
  }

  function downloadFile(file, name) {
    var url = URL.createObjectURL(file);
    var link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    try {
      link.click();
    } finally {
      link.remove();
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }
  }

  function downloadStarter(framework) {
    try {
      var connection = {
        searchURL: config.searchURL,
        searchAuth: config.searchAuth,
        model: config.before,
        experience: (design.profileTabs || design.languagePicker) ? experiencePreview.handoff() : undefined,
        kitURL: document.querySelector('#searchstax-ui-kit').src,
      };
      var starter = {
        javascript: { create: createStarterZip, name: 'searchstax-vanilla-starter.zip' },
        react: { create: createReactStarterZip, name: 'searchstax-react-starter.zip' },
        vue: { create: createVueStarterZip, name: 'searchstax-vue-starter.zip' },
        angular: { create: createAngularStarterZip, name: 'searchstax-angular-starter.zip' },
      }[framework];
      downloadFile(starter.create(design, connection, FACET_LABELS), starter.name);
      codeFeedback.textContent = 'Download started. Unzip the starter and open its README for setup.';
    } catch {
      codeFeedback.textContent = 'Couldn’t prepare the starter. Try downloading it again.';
    }
  }

  function clearStaleShareLinks() {
    for (const field of shareFields) {
      if (field.value && field.value !== sharedURL()) {
        field.hidden = true;
        field.value = '';
        field.parentElement.querySelector('[role="status"]').textContent = '';
      }
    }
  }

  function getConstructor() {
    if (typeof window.Searchstax === 'function') return window.Searchstax;
    if (window.Searchstax && typeof window.Searchstax.Searchstax === 'function') return window.Searchstax.Searchstax;
    var namespace = window['@searchstaxInc/searchstudioUxJs'];
    return namespace && typeof namespace.Searchstax === 'function' ? namespace.Searchstax : null;
  }

  function validSearchURL(value) {
    try {
      var url = new URL(value);
      return url.protocol === 'https:' && /(^|\.)searchstax\.com$/i.test(url.hostname) && /\/emselect\/?$/.test(url.pathname);
    } catch {
      return false;
    }
  }

  function isDemoResultURL(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && url.hostname === 'mw-searchstax.github.io' &&
        url.pathname.startsWith('/university-health-search-demo/');
    } catch { return false; }
  }

  function safeResults(items) {
    return items.filter(item => isDemoResultURL(item.url)).map(function (item) {
      return Object.assign({}, item, {
        title: demoResultTitle(item.title),
        description: demoResultText(item.description),
        demoThumbnail: demoThumbnails[item.url]?.source,
      });
    });
  }

  function selectedOrder() {
    return workspaceMode === 'design' && design.showSorting ? sortOrder.value : '';
  }

  function selectedPageSize() {
    return workspaceMode === 'design' ? design.resultsPerPage : DEFAULT_DESIGN.resultsPerPage;
  }

  function runSearch(query, clearFilters, preserveDraft = false, previousSearch) {
    if (!search || customerPreview.active) return;
    if (!query.trim()) {
      queryInput.setCustomValidity('Enter a search term to explore the demo.');
      queryInput.reportValidity();
      queryInput.setCustomValidity('');
      return;
    }
    var current = search.dataLayer.searchObject;
    var compareRanking = workspaceMode === 'examples' && state.scenario === 'ranking' && state.phase === 'after';
    var model = workspaceMode !== 'examples' || state.phase === 'before' ? config.before
      : (compareRanking ? config.rankingAfter : config.after);
    if (!model || (compareRanking && (model === config.before || model === config.after))) {
      showUnavailable('The Ranking example hasn’t been configured yet.');
      return;
    }
    relatedQuery = query.trim();
    updateRelated();
    var cleanQuery = query.trim();
    if (workspaceMode === 'examples') {
      var afterProfile = state.scenario === 'ranking' ? config.rankingAfter : config.after;
      void relevanceComparison.compare(cleanQuery, state.scenario, afterProfile);
    }
    var order = selectedOrder();
    var itemsPerPage = selectedPageSize();
    var promotions = selectedPromotions(cleanQuery);
    var page = previousSearch?.page ?? 1;
    var filtersUnchanged = previousSearch ? JSON.stringify(current.facets) === JSON.stringify(previousSearch.facets)
      : (!clearFilters || !current.facets.length);
    var unchanged = current.query === cleanQuery && current.model === model && current.page === page &&
      current.order === order && current.itemsPerPage === itemsPerPage && filtersUnchanged;
    if (unchanged && completed && expected.promotions === promotions) {
      if (!preserveDraft) queryInput.value = cleanQuery;
      status.textContent = '';
      resultsContent.hidden = false;
      pagination.hidden = false;
      return;
    }
    expected = { query: cleanQuery, model: model, order: order, itemsPerPage: itemsPerPage, promotions: promotions };
    clearStaleShareLinks();
    completed = false;
    if (workspaceMode === 'examples') summary.textContent = '';
    if (!preserveDraft) queryInput.value = expected.query;
    busy(true);
    search.dataLayer.setModel(model);
    search.dataLayer.setItemsPerPage(itemsPerPage);
    var nextSearch = Object.assign({}, current, {
      query: expected.query,
      page: page,
      itemsPerPage: itemsPerPage,
      facets: previousSearch?.facets ?? (clearFilters ? [] : current.facets),
      model: model,
      order: order,
    });
    if (unchanged) search.search(nextSearch);
    else search.dataLayer.setSearchObject(nextSearch);
  }

  function refreshSearchOptions() {
    if (!experiencePanel.hidden) return;
    var current = search?.dataLayer.searchObject;
    if (current?.query && (current.order !== selectedOrder() || current.itemsPerPage !== selectedPageSize() ||
      expected?.promotions !== selectedPromotions(current.query))) {
      runSearch(current.query, false, true);
    }
  }

  function initialize() {
    var Searchstax = getConstructor();
    if (!validSearchURL(config.searchURL) || !config.searchAuth ||
      !config.before || !config.after || config.before === config.after) {
      showUnavailable();
      return;
    }
    if (!Searchstax) {
      showUnavailable();
      return;
    }

    try {
      search = new Searchstax();
      search.initialize({
        language: 'en',
        model: config.before,
        searchURL: config.searchURL,
        searchAuth: config.searchAuth,
        authType: 'token',
        suggesterURL: '',
        trackApiKey: '',
        router: { enabled: false },
        hooks: {
          afterSearch: function (items, response) {
            var params = response && response.responseHeader && response.responseHeader.params;
            var total = response && response.response && response.response.numFound;
            if (!expected || !params || params.q !== expected.query || params.model !== expected.model ||
              (params.sort || 'score desc') !== (expected.order || 'score desc') ||
              Number(params.rows) !== expected.itemsPerPage || typeof total !== 'number') {
              return search.dataLayer.searchResults || [];
            }
            completed = true;
            noMatches = total === 0;
            summary.textContent = total + (total === 1 ? ' result' : ' results') + ' for “' + expected.query + '”';
            window.setTimeout(finishSearch, 0);
            if (workspaceMode !== 'design') return applySampleIndexedPromotion(safeResults(items || []), response, expected.promotions);
            const { cards, mappingsKnown } = resultCards(response, response.response.docs);
            if (!mappingsKnown) summary.textContent += '. Results Fields are unknown for this profile.';
            const mapped = cards.flatMap((card, index) => {
              if (card.url && !isDemoResultURL(card.url)) return [];
              if (!card.url && !card.thumbnail && !card.values.length) return [];
              for (const value of card.values) {
                if (value.role === 'title' && !value.highlighted) value.value = demoResultTitle(value.value);
                else value.value = demoResultText(value.value);
              }
              const body = document.createElement('div');
              appendResultCard(body, card);
              const link = body.querySelector('a');
              if (link) link.setAttribute('data-searchstax-unique-result-id', items[index]?.uniqueId ?? '');
              return [{ ...items[index], url: card.url, mappedBody: body.innerHTML,
                demoThumbnail: card.thumbnail ? '' : demoThumbnails[card.url]?.source }];
            });
            return applySampleIndexedPromotion(mapped, response, expected.promotions);
          },
        },
      });
      search.setCookiesDisabled(true);
      search.addSearchResultsWidget('lab-results', {
        renderMethod: 'pagination',
        resultsPerPage: selectedPageSize(),
        templates: {
          mainTemplate: {
            template: '<div id="lab-results-list" class="searchstax-search-results"></div>',
            searchResultsContainerId: 'lab-results-list',
          },
          searchResultTemplate: {
            template: '<article class="searchstax-search-result {{#mappedBody}}mapped-result-card{{/mappedBody}}">{{#sampleIndexedPromotion}}<span class="sample-indexed-promotion">Sample indexed promotion</span>{{/sampleIndexedPromotion}}{{#demoThumbnail}}<img class="search-lab__result-thumbnail" src="{{demoThumbnail}}" alt="" width="384" height="216" loading="lazy">{{/demoThumbnail}}{{#mappedBody}}{{{mappedBody}}}{{/mappedBody}}{{^mappedBody}}<h4><a class="searchstax-search-result-title" href="{{url}}" data-searchstax-unique-result-id="{{uniqueId}}">{{title}}</a></h4><p class="search-lab__result-description">{{description}}</p>{{/mappedBody}}</article>',
            searchResultUniqueIdAttribute: 'data-searchstax-unique-result-id',
          },
          noSearchResultTemplate: { template: ' ' },
        },
      });
      search.addFacetsWidget('lab-facets', {
        facetingType: 'or',
        specificFacets: ['demo_content_type_s'],
        itemsPerPageDesktop: 20,
        itemsPerPageMobile: 20,
        templates: {
          mainTemplateDesktop: { template: '<div class="lab-facet-groups"></div>', facetsContainerClass: 'lab-facet-groups' },
          mainTemplateMobile: { template: ' ' },
          facetItemContainerTemplate: {
            template: '<fieldset><legend>Content type</legend><div class="lab-facet-options search-facet-choices"></div></fieldset>',
            facetListContainerClass: 'lab-facet-options',
          },
          facetItemTemplate: {
            template: '<label class="search-lab__facet-option"><input class="lab-facet-checkbox" type="checkbox" {{#disabled}}disabled{{/disabled}} {{#isChecked}}checked{{/isChecked}}><span data-lab-type="{{value}}">{{value}}</span><span class="search-lab__facet-count">{{count}}</span></label>',
            inputCheckboxClass: 'lab-facet-checkbox',
            checkTriggerClasses: [],
          },
        },
      });
      new MutationObserver(labelFacets).observe(facets, { childList: true, subtree: true });
      search.addPaginationWidget('lab-pagination', {
        templates: { mainTemplate: {
          template: '{{#results.length}}<nav class="search-lab__pagination" aria-label="Search result pages"><span tabindex="-1" data-page-range data-page-start="{{startResultIndex}}">{{startResultIndex}}–{{endResultIndex}} of {{totalResults}} results</span>{{^isFirstPage}}<button type="button" data-page-step="previous">Previous</button>{{/isFirstPage}}{{^isLastPage}}<button type="button" data-page-step="next">Next</button>{{/isLastPage}}</nav>{{/results.length}}',
        } },
      });
      search.dataLayer.$loadingChange.subscribe(function (loading) {
        if (loading) {
          showSearchProgress();
        } else {
          finishSearch();
          window.setTimeout(finishSearch, 0);
        }
      });
      runSearch(sampleQuery(), true);
    } catch {
      search = null;
      showUnavailable();
    }
  }

  root.querySelectorAll('input[name="lab-layout"]').forEach(function (input) {
    input.addEventListener('change', function () {
      if (isLayout(input.value)) design.layout = input.value;
      updateDesign();
    });
  });
  for (const [input, field] of [[colorInput, 'color'], [backgroundInput, 'background']]) {
    input.addEventListener('input', function () {
      if (isHexColor(input.value)) design[field] = input.value;
      updateDesign();
    });
  }
  cornersInput.addEventListener('change', function () {
    design.corners = readCorners(cornersInput.value);
    updateDesign();
  });
  function applyLogoInput() {
    window.clearTimeout(logoTimer);
    const value = logoInput.value.trim();
    const url = readLogoURL(value);
    if (value && !url) {
      logoInput.setAttribute('aria-invalid', 'true');
      showLogoStatus('Enter a valid HTTPS image URL.');
      return;
    }
    logoInput.removeAttribute('aria-invalid');
    if (design.logoURL !== url) {
      clearDesignFeedback();
      codeFeedback.textContent = '';
    }
    design.logoURL = url;
    updateLogo();
    saveDesignDraft();
  }
  logoInput.addEventListener('change', applyLogoInput);
  logoInput.addEventListener('input', function () {
    window.clearTimeout(logoTimer);
    logoTimer = window.setTimeout(applyLogoInput, 350);
  });
  logo.addEventListener('load', function () {
    logo.hidden = false;
    showLogoStatus('');
  });
  logo.addEventListener('error', function () {
    logo.hidden = true;
    if (logo.hasAttribute('src')) showLogoStatus('The logo couldn’t load. Check the image URL.');
  });
  dividerToggle.addEventListener('change', function () {
    design.listDividers = dividerToggle.checked;
    updateDesign();
  });
  underlineToggle.addEventListener('change', function () {
    design.underlineTitles = underlineToggle.checked;
    updateDesign();
  });
  fontInput.addEventListener('change', function () {
    if (isFont(fontInput.value)) design.font = fontInput.value;
    updateDesign();
  });
  spacingInput.addEventListener('change', function () {
    if (isResultSpacing(spacingInput.value)) design.resultSpacing = spacingInput.value;
    updateDesign();
  });
  pageSizeInput.addEventListener('change', function () {
    design.resultsPerPage = readPageSize(pageSizeInput.value);
    updateDesign();
    refreshSearchOptions();
  });
  Object.keys(textInputs).forEach(function (key) {
    var input = textInputs[key];
    input.addEventListener('input', function () {
      design[key] = resolveSearchText(input.value, DEFAULT_DESIGN[key]);
      clearDesignFeedback();
      updatePreviewText();
      experiencePreview.configure(design);
      codeFeedback.textContent = '';
      saveDesignDraft();
    });
  });
  scenarioInput.addEventListener('change', function () {
    if (!Object.prototype.hasOwnProperty.call(SCENARIOS, scenarioInput.value)) return;
    state.scenario = scenarioInput.value;
    state.phase = 'before';
    state.rankingPreset = '';
    updateScenario();
    queryInput.value = SCENARIOS[state.scenario].query;
    runSearch(queryInput.value, true);
  });
  topFilterStyle.addEventListener('change', function () {
    design.topFilterStyle = topFilterStyle.value;
    updateDesign();
  });
  filterPlacement.addEventListener('change', function () {
    design.filterPlacement = filterPlacement.value;
    updateDesign();
  });
  relatedPlacement.addEventListener('change', function () {
    design.relatedPlacement = relatedPlacement.value;
    updateDesign();
  });
  relatedToggle.addEventListener('change', function () {
    design.relatedPlacement = relatedToggle.checked ? relatedPlacement.value : 'off';
    updateDesign();
    if (!relatedToggle.checked || customerPreview.active) return;
    showDesignPreview();
    if (!experiencePanel.hidden) {
      if (!experiencePanel.querySelector('.search-related-terms:not([hidden])')) {
        experiencePreview.submit(experiencePreview.spanishDemo ? 'rehabilitación' : 'rehabilitation');
      }
      requestAnimationFrame(() => experiencePanel.querySelector('.search-related-terms:not([hidden])')?.scrollIntoView({ block: 'center' }));
      return;
    }
    if (!demoRelatedSource(relatedQuery).length) runSearch('rehabilitation', true);
    requestAnimationFrame(() => root.querySelector('#lab-preview .search-related-terms:not([hidden])')?.scrollIntoView({ block: 'center' }));
  });
  filterToggle.addEventListener('change', function () {
    design.filters = filterToggle.checked;
    updateDesign();
    if (experiencePanel.hidden && !design.filters && search && search.dataLayer.searchObject.facets.length) runSearch(queryInput.value, true);
  });
  descriptionToggle.addEventListener('change', function () {
    design.showDescriptions = descriptionToggle.checked;
    updateDesign();
  });
  thumbnailToggle.addEventListener('change', function () {
    design.showThumbnails = thumbnailToggle.checked;
    updateDesign();
  });
  sortingToggle.addEventListener('change', function () {
    design.showSorting = sortingToggle.checked;
    updateDesign();
    refreshSearchOptions();
  });
  sortOrder.addEventListener('change', refreshSearchOptions);
  function showSuggestionDemo() {
    if (!suggestionDemoPending || (experiencePanel.hidden && queryInput.disabled)) return;
    suggestionDemoPending = false;
    if (!design.showSuggestions || customerPreview.active || root.dataset.labView !== 'design') return;
    showDesignPreview();
    const field = experiencePanel.hidden ? queryInput : experiencePanel.querySelector('input[type="search"]');
    field.value = 'reh';
    field.focus();
    field.scrollIntoView({ block: 'center' });
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }

  suggestionsToggle.addEventListener('change', function () {
    design.showSuggestions = suggestionsToggle.checked;
    suggestionDemoPending = design.showSuggestions;
    updateDesign();
    showSuggestionDemo();
  });
  smartAnswersSampleToggle.addEventListener('change', function () {
    design.showSmartAnswersSample = smartAnswersSampleToggle.checked;
    updateDesign();
  });
  promotionsInput.addEventListener('change', function () {
    design.samplePromotions = readSamplePromotions(promotionsInput.value);
    updateDesign();
    if (design.samplePromotions === 'off') {
      refreshSearchOptions();
      return;
    }
    if (design.samplePromotions === 'indexed' || design.samplePromotions === 'both') sortOrder.value = '';
    showDesignPreview();
    if (experiencePanel.hidden) {
      runSearch(samplePromotionQuery, true);
      summary.scrollIntoView({ block: 'center' });
    } else {
      experiencePreview.submit(experiencePreview.promotionQuery);
      experiencePanel.querySelector('[data-exp-promotions]').scrollIntoView({ block: 'center' });
    }
  });
  phaseButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      state.phase = button.getAttribute('data-lab-phase');
      updatePhase();
      runSearch(queryInput.value, true);
    });
  });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (customerPreview.active) {
      relatedQuery = queryInput.value.trim();
      updateRelated();
      customerPreview.search(queryInput.value);
      return;
    }
    runSearch(queryInput.value, true);
    if (!queryInput.value.trim()) queryInput.focus();
  });
  sampleButton.addEventListener('click', function () { runSearch(sampleQuery(), true); });
  tryNoResults.addEventListener('click', function () {
    showDesignPreview();
    if (experiencePanel.hidden) {
      queryInput.focus();
      runSearch('qzxvzz', true);
    } else {
      experiencePanel.querySelector('input[type="search"]').focus();
      experiencePreview.submit('qzxvzz');
    }
  });
  rankingButtons.forEach(function (button) {
    button.addEventListener('click', function () { runSearch(button.dataset.labRankingQuery, true); });
  });
  const handoffButtons = [...root.querySelectorAll('.search-lab__handoff-actions button')];
  function setHandoffPanel(selected) {
    for (const control of handoffButtons) {
      const expanded = control === selected;
      control.setAttribute('aria-expanded', String(expanded));
      document.getElementById(control.getAttribute('aria-controls')).hidden = !expanded;
    }
  }
  for (const button of handoffButtons) {
    button.addEventListener('click', function () {
      setHandoffPanel(button.getAttribute('aria-expanded') === 'true' ? null : button);
    });
  }
  root.querySelector('[data-lab-local-share]').hidden =
    !['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
  root.querySelectorAll('[data-lab-share]').forEach(function (button) {
    const field = button.parentElement.querySelector('.search-lab__share-url');
    const message = button.parentElement.querySelector('[role="status"]');
    button.addEventListener('click', async function () {
      const url = sharedURL();
      const copied = await tryCopyText(url);
      if (url !== sharedURL()) return;
      field.hidden = copied;
      field.value = copied ? '' : url;
      message.textContent = copied ? 'Link copied.' : 'Copy the link below to share it.';
      if (!copied && button === document.activeElement) {
        field.focus();
        field.select();
        field.scrollLeft = 0;
      }
    });
  });
  root.querySelectorAll('[data-lab-download-starter]').forEach(function (button) {
    button.addEventListener('click', function () { downloadStarter(button.dataset.labDownloadStarter); });
  });
  root.querySelector('[data-lab-download-css]').addEventListener('click', function () {
    var css = new Blob([renderStarterCSS(design)], { type: 'text/css' });
    downloadFile(css, 'searchstax-search.css');
    cssFeedback.textContent = 'CSS download started.';
  });
  root.querySelector('[data-lab-copy-css]').addEventListener('click', async function () {
    const copied = await tryCopyText(renderStarterCSS(design));
    cssFeedback.textContent = copied
      ? 'CSS copied. Use it with the starter markup or adapt the selectors for your templates.'
      : 'Use Download CSS to save your stylesheet.';
  });
  resetButton.addEventListener('click', function () {
    const current = search?.dataLayer.searchObject;
    const previous = designBeforeReset ?? {
      design: { ...design },
      connectedOrder: customerPreview.order,
      profileSearch: experiencePanel.hidden ? null : experiencePreview.searchState,
      preview: !customerPreview.active && current?.query ? {
        query: current.query,
        draft: queryInput.value,
        page: current.page,
        facets: [...current.facets],
        order: sortOrder.value,
      } : null,
    };
    design = { ...DEFAULT_DESIGN };
    sortOrder.value = '';
    updateDesign('');
    setHandoffPanel(null);
    root.querySelectorAll('#lab-design-controls details').forEach(details => {
      details.open = details.hasAttribute('data-default-open');
    });
    answerSample.open = false;
    if (!customerPreview.active) {
      queryInput.value = sampleQuery();
      runSearch(queryInput.value, true);
    }
    designBeforeReset = previous;
    undoResetButton.hidden = false;
    designFeedback.textContent = customerPreview.active ? 'Design settings reset.' : 'Design and demo search reset.';
  });
  undoResetButton.addEventListener('click', function () {
    if (!designBeforeReset) return;
    const { design: previousDesign, preview, profileSearch, connectedOrder } = designBeforeReset;
    design = previousDesign;
    resetButton.focus({ preventScroll: true });
    updateDesign(connectedOrder);
    if (preview && !customerPreview.active) {
      sortOrder.value = preview.order;
      queryInput.value = preview.draft;
      runSearch(preview.query, false, true, preview);
    }
    if (profileSearch && !experiencePanel.hidden) experiencePreview.open(profileSearch.query, profileSearch.draft);
    designFeedback.textContent = 'Previous design restored.';
  });

  readSharedSettings();
  updateDesign();
  var exampleRoutes = new Map([
    ['#lab-ranking', { scenario: 'ranking', back: '#lab-find-page', label: 'Back to Tool Options' }],
    ['#lab-compare-ranking', { scenario: 'ranking', back: '#lab-ranking-guide', label: 'Back to the Ranking Walkthrough' }],
  ]);
  const showDesignPreview = setupLabNavigation(root, function (view, hash) {
    updateExperienceMode();
    showImprovePreview(view, hash);
    showDataFilters(view === 'data-filters');
    if (view !== 'examples') relevanceComparison.clear();
    if (view !== 'design') related.clear();
    if (view !== 'design') customerPreview.disconnect();
    syncFeatureControls();
    updateFeatureSamples();
    if (view !== 'design' && view !== 'examples') return;
    var exampleRoute = exampleRoutes.get(hash);
    if (view === 'examples') {
      var back = root.querySelector('[data-lab-example-back]');
      var backLabel = root.querySelector('[data-lab-example-back-label]');
      back.href = exampleRoute?.back ?? '#lab-improve';
      backLabel.textContent = exampleRoute?.label ?? 'Back to Improve What People Find';
    }
    if (exampleRoute) {
      state.scenario = exampleRoute.scenario;
      state.phase = 'before';
      state.rankingPreset = '';
    } else if (view === workspaceMode) {
      return;
    }
    var firstVisit = !workspaceMode;
    workspaceMode = view;
    updatePreviewText();
    updateScenario();
    queryInput.value = sampleQuery();
    chooseDemoAnchor(queryInput);
    if (firstVisit) initialize();
    else if (search) runSearch(queryInput.value, true);
  });
})();
