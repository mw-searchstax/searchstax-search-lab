(function () {
  'use strict';

  var root = document.querySelector('[data-search-lab]');
  if (!root) return;

  var SCENARIOS = {
    fields: {
      query: 'travel vaccinations',
      name: 'SEARCH FIELDS',
      intro: 'See how Search Fields can help a page match a search.',
      copy: 'The fictional International Health page includes “Travel Vaccinations” in a service-name field.',
      before: 'Before: the service-name field isn’t included in Search Fields.',
      after: 'After: the service-name field is included in Search Fields.',
      note: 'The same query runs against a prepared demo profile. Adding a field can make a page eligible to match; it doesn’t guarantee its position.',
      doc: 'https://support.searchstax.com/hc/en-us/articles/40483375841421-Search-Fields',
      docLabel: 'Learn about Search Fields',
      video: 'https://support.searchstax.com/hc/en-us/articles/50357414946317-Search-Fields-Video',
      videoLabel: 'Watch the Search Fields video',
    },
    ranking: {
      query: 'rehabilitation',
      name: 'RANKING',
      intro: 'See how a Search Field boost can change result order.',
      copy: 'For “rehabilitation,” compare pages that match through their titles and other fields.',
      before: 'Before: the title field has no additional Ranking boost.',
      after: 'After: the title field has a 1.5 Search Field boost.',
      note: 'A boost can change the order of multiple results; it doesn’t guarantee a position. Review the full list and try other searches.',
      doc: 'https://support.searchstax.com/hc/en-us/articles/40151648011149-Ranking',
      docLabel: 'Learn about Ranking',
      video: 'https://support.searchstax.com/hc/en-us/articles/50357479982989-Give-Selected-Search-Fields-More-Influence-Video',
      videoLabel: 'Watch the Search Field Boosts video',
    },
  };
  var DEFAULT_COLOR = '#a33c22';
  var DEFAULT_FONT = 'arial';
  var PREVIEW_STORAGE_KEY = 'search-lab-preview-connection';
  var FONT_STACKS = {
    arial: 'Arial, Helvetica, sans-serif',
    verdana: 'Verdana, Geneva, sans-serif',
    tahoma: 'Tahoma, Geneva, sans-serif',
    trebuchet: '"Trebuchet MS", Helvetica, sans-serif',
    georgia: 'Georgia, "Times New Roman", serif',
    times: '"Times New Roman", Times, serif',
    courier: '"Courier New", Courier, monospace',
  };
  var FACET_LABELS = {
    community: 'Community', hub: 'Overview pages', location: 'Locations', news: 'News',
    program: 'Education programs', provider: 'Providers', research: 'Research',
    resource: 'Resources', service: 'Services',
  };
  var form = root.querySelector('[data-lab-search-form]');
  var queryInput = root.querySelector('#lab-query');
  var filterToggle = root.querySelector('#lab-filters');
  var colorInput = root.querySelector('#lab-accent');
  var fontInput = root.querySelector('#lab-font');
  var scenarioInput = root.querySelector('#lab-scenario');
  var setup = root.querySelector('[data-lab-setup]');
  var setupForm = root.querySelector('[data-lab-setup-form]');
  var facetsPanel = root.querySelector('[data-lab-facets-panel]');
  var facets = root.querySelector('#lab-facets');
  var resultsLayout = root.querySelector('[data-lab-results-layout]');
  var resultHost = root.querySelector('#lab-results');
  var pagination = root.querySelector('#lab-pagination');
  var status = root.querySelector('[data-lab-status]');
  var summary = root.querySelector('[data-lab-summary]');
  var feedback = root.querySelector('[data-lab-feedback]');
  var explanation = root.querySelector('[data-lab-explanation]');
  var profileLabel = root.querySelector('[data-lab-profile-label]');
  var facetEmpty = root.querySelector('[data-lab-facet-empty]');
  var phaseButtons = Array.prototype.slice.call(root.querySelectorAll('[data-lab-phase]'));
  var config = {
    searchURL: root.getAttribute('data-search-url') || '',
    searchAuth: root.getAttribute('data-search-credential') || '',
    before: root.getAttribute('data-before-profile') || '',
    after: root.getAttribute('data-after-profile') || '',
    rankingAfter: root.getAttribute('data-ranking-profile') || '',
  };
  var state = { layout: 'list', filters: true, color: DEFAULT_COLOR, font: DEFAULT_FONT, scenario: 'fields', phase: 'before' };
  var search;
  var expected;
  var completed = false;
  var requestTimer;
  var restoreFocus;

  // The credential is for the public, read-only demo search only. Remove it
  // from the DOM after initialization; never copy it into a shareable link.
  root.removeAttribute('data-search-credential');

  function colorText(hex) {
    var channels = [1, 3, 5].map(function (index) {
      var channel = parseInt(hex.slice(index, index + 2), 16) / 255;
      return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
    });
    var luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    return (luminance + 0.05) / 0.05 >= 1.05 / (luminance + 0.05) ? '#000000' : '#ffffff';
  }

  function updateDesign() {
    root.setAttribute('data-layout', state.layout);
    root.style.setProperty('--lab-accent', state.color);
    root.style.setProperty('--lab-accent-text', colorText(state.color));
    root.style.setProperty('--preview-font', FONT_STACKS[state.font]);
    resultsLayout.setAttribute('data-filters', state.filters ? 'on' : 'off');
    facetsPanel.hidden = !state.filters;
    filterToggle.checked = state.filters;
    colorInput.value = state.color;
    fontInput.value = state.font;
    root.querySelector('input[name="lab-layout"][value="' + state.layout + '"]').checked = true;
  }

  function updatePhase() {
    phaseButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-lab-phase') === state.phase));
    });
    profileLabel.textContent = state.phase === 'after' ? 'After' : 'Before';
    explanation.textContent = SCENARIOS[state.scenario][state.phase];
  }

  function updateScenario() {
    var scenario = SCENARIOS[state.scenario];
    scenarioInput.value = state.scenario;
    root.querySelector('[data-lab-lesson-intro]').textContent = scenario.intro;
    root.querySelector('[data-lab-lesson-name]').textContent = scenario.name;
    root.querySelector('[data-lab-lesson-copy]').textContent = scenario.copy;
    root.querySelector('[data-lab-lesson-note]').textContent = scenario.note;
    root.querySelector('[data-lab-comparison]').setAttribute('aria-label', (state.scenario === 'ranking' ? 'Ranking' : 'Search Fields') + ' comparison');
    root.querySelector('[data-lab-sample]').textContent = scenario.query;
    root.querySelector('[data-lab-doc]').href = scenario.doc;
    root.querySelector('[data-lab-doc-label]').textContent = scenario.docLabel;
    root.querySelector('[data-lab-video]').href = scenario.video;
    root.querySelector('[data-lab-video-label]').textContent = scenario.videoLabel;
    updatePhase();
  }

  function busy(value) {
    if (value && (document.activeElement === queryInput || document.activeElement === form.querySelector('button') ||
      document.activeElement === root.querySelector('[data-lab-sample]') || document.activeElement === scenarioInput ||
      phaseButtons.indexOf(document.activeElement) !== -1)) {
      restoreFocus = document.activeElement;
    }
    resultsLayout.setAttribute('aria-busy', String(value));
    form.querySelector('button').disabled = value;
    queryInput.disabled = value;
    root.querySelector('[data-lab-sample]').disabled = value;
    scenarioInput.disabled = value;
    phaseButtons.forEach(function (button) { button.disabled = value; });
    if (!value && restoreFocus) {
      if (document.activeElement === document.body || document.activeElement === document.documentElement) {
        restoreFocus.focus({ preventScroll: true });
      }
      restoreFocus = null;
    }
  }

  function showUnavailable(message) {
    window.clearTimeout(requestTimer);
    busy(false);
    if (!search) {
      queryInput.disabled = true;
      form.querySelector('button').disabled = true;
      root.querySelector('[data-lab-sample]').disabled = true;
      phaseButtons.forEach(function (button) { button.disabled = true; });
    }
    resultHost.hidden = true;
    pagination.hidden = true;
    status.textContent = message || 'The live demo is unavailable right now. Please try again later.';
    summary.textContent = 'Search results';
  }

  function finishSearch() {
    if (!completed || !search || search.dataLayer.loading) return;
    window.clearTimeout(requestTimer);
    busy(false);
    resultHost.hidden = false;
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
    var layout = params.get('lab_layout');
    var color = params.get('lab_color');
    var font = params.get('lab_font');
    var scenario = params.get('lab_scenario');
    var phase = params.get('lab_view');
    if (layout === 'list' || layout === 'cards') state.layout = layout;
    if (/^[0-9a-f]{6}$/i.test(color || '')) state.color = '#' + color.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(FONT_STACKS, font)) state.font = font;
    if (Object.prototype.hasOwnProperty.call(SCENARIOS, scenario)) state.scenario = scenario;
    if (params.get('lab_filters') === 'off') state.filters = false;
    if (phase === 'before' || phase === 'after') state.phase = phase;
  }

  function sharedURL() {
    var url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    url.searchParams.set('lab_layout', state.layout);
    url.searchParams.set('lab_color', state.color.slice(1));
    url.searchParams.set('lab_font', state.font);
    url.searchParams.set('lab_filters', state.filters ? 'on' : 'off');
    url.searchParams.set('lab_scenario', state.scenario);
    url.searchParams.set('lab_view', state.phase);
    return url.href;
  }

  function starterCSS() {
    var columns = state.layout === 'cards'
      ? '\n@media (min-width: 1050px) {\n  .searchstax-search-results { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n}\n'
      : '';
    return '/* Starter styles for the SearchStax JavaScript UI Kit results. */\n' +
      '.searchstax-search-results { display: grid; grid-template-columns: 1fr; gap: 12px; font-family: ' + FONT_STACKS[state.font] + '; }\n' +
      '.searchstax-search-result { border-left: 3px solid ' + state.color + '; }\n' + columns;
  }

  function copyText(value, successMessage) {
    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
      feedback.textContent = 'Copy isn’t available in this browser.';
      return;
    }
    navigator.clipboard.writeText(value).then(function () {
      feedback.textContent = successMessage;
    }).catch(function () {
      feedback.textContent = 'Couldn’t copy. Please try again.';
    });
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

  function restorePreviewConnection() {
    if (!document.body.hasAttribute('data-lab-preview')) return;
    if (validSearchURL(config.searchURL) && config.searchAuth && config.before && config.after && config.before !== config.after) return;
    try {
      var saved = JSON.parse(window.sessionStorage.getItem(PREVIEW_STORAGE_KEY) || 'null');
      if (saved && validSearchURL(saved.searchURL) && typeof saved.searchAuth === 'string' && saved.searchAuth &&
        typeof saved.before === 'string' && saved.before && typeof saved.after === 'string' && saved.after && saved.before !== saved.after) {
        config = { searchURL: saved.searchURL, searchAuth: saved.searchAuth, before: saved.before, after: saved.after,
          rankingAfter: typeof saved.rankingAfter === 'string' && saved.rankingAfter ? saved.rankingAfter : config.rankingAfter };
      }
    } catch {
      // Storage can be disabled. The preview setup remains available.
    }
  }

  function safeResults(items) {
    return items.filter(function (item) {
      try {
        var url = new URL(item.url);
        return url.protocol === 'https:' && url.hostname === 'mw-searchstax.github.io' &&
          url.pathname.indexOf('/university-health-search-demo/') === 0;
      } catch {
        return false;
      }
    }).map(function (item) {
      return Object.assign({}, item, {
        title: typeof item.title === 'string' ? item.title.replace(/\s*\|\s*Alder Coast University Health$/, '') : '',
      });
    });
  }

  function runSearch(query, clearFilters) {
    if (!search) return;
    if (!query.trim()) {
      resultHost.hidden = true;
      pagination.hidden = true;
      summary.textContent = 'Search results';
      status.textContent = 'Enter a search term to explore the demo.';
      return;
    }
    var current = search.dataLayer.searchObject;
    var model = state.phase === 'before' ? config.before : (state.scenario === 'ranking' ? config.rankingAfter : config.after);
    if (!model || (state.scenario === 'ranking' && state.phase === 'after' && (model === config.before || model === config.after))) {
      showUnavailable('The Ranking example hasn’t been configured yet.');
      return;
    }
    var cleanQuery = query.trim();
    var unchanged = current.query === cleanQuery && current.model === model && current.page === 1 &&
      (!clearFilters || !current.facets.length);
    if (unchanged && completed) {
      queryInput.value = cleanQuery;
      status.textContent = '';
      resultHost.hidden = false;
      pagination.hidden = false;
      return;
    }
    expected = { query: cleanQuery, model: model };
    completed = false;
    queryInput.value = expected.query;
    busy(true);
    status.textContent = 'Searching the demo…';
    resultHost.hidden = true;
    pagination.hidden = true;
    window.clearTimeout(requestTimer);
    requestTimer = window.setTimeout(showUnavailable, 15000);
    search.dataLayer.setModel(model);
    var nextSearch = Object.assign({}, current, {
      query: expected.query,
      page: 1,
      facets: clearFilters ? [] : current.facets,
      model: model,
    });
    if (unchanged) search.search(nextSearch);
    else search.dataLayer.setSearchObject(nextSearch);
  }

  function initialize() {
    var Searchstax = getConstructor();
    if (!validSearchURL(config.searchURL) || !config.searchAuth ||
      !config.before || !config.after || config.before === config.after) {
      if (document.body.hasAttribute('data-lab-preview')) setup.hidden = false;
      showUnavailable('The live demo hasn’t been configured yet.');
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
            if (!expected || !params || params.q !== expected.query || params.model !== expected.model || typeof total !== 'number') {
              return search.dataLayer.searchResults || [];
            }
            completed = true;
            summary.textContent = total + (total === 1 ? ' result' : ' results') + ' for “' + expected.query + '”';
            window.setTimeout(finishSearch, 0);
            return safeResults(Array.isArray(items) ? items : []);
          },
        },
      });
      search.setCookiesDisabled(true);
      search.addSearchResultsWidget('lab-results', {
        renderMethod: 'pagination',
        resultsPerPage: 10,
        templates: {
          mainTemplate: {
            template: '<div id="lab-results-list" class="searchstax-search-results"></div>',
            searchResultsContainerId: 'lab-results-list',
          },
          searchResultTemplate: {
            template: '<article class="searchstax-search-result"><h4><a class="searchstax-search-result-title" href="{{url}}" data-searchstax-unique-result-id="{{uniqueId}}">{{title}}</a></h4><p>{{description}}</p></article>',
            searchResultUniqueIdAttribute: 'data-searchstax-unique-result-id',
          },
          noSearchResultTemplate: {
            template: '{{#searchExecuted}}<p class="search-lab__no-results">No matching pages. Try another search or remove a filter.</p>{{/searchExecuted}}',
          },
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
            template: '<fieldset><legend>Content type</legend><div class="lab-facet-options"></div></fieldset>',
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
          template: '{{#results.length}}<nav class="search-lab__pagination" aria-label="Search result pages"><span>{{startResultIndex}}–{{endResultIndex}} of {{totalResults}} results</span>{{^isFirstPage}}<button type="button" class="lab-previous">Previous</button>{{/isFirstPage}}{{^isLastPage}}<button type="button" class="lab-next">Next</button>{{/isLastPage}}</nav>{{/results.length}}',
          previousButtonClass: 'lab-previous', nextButtonClass: 'lab-next',
        } },
      });
      search.dataLayer.setItemsPerPage(10);
      search.dataLayer.$loadingChange.subscribe(function (loading) {
        if (loading) {
          resultsLayout.setAttribute('aria-busy', 'true');
        } else {
          finishSearch();
          window.setTimeout(finishSearch, 0);
        }
      });
      runSearch(SCENARIOS[state.scenario].query, true);
    } catch {
      search = null;
      showUnavailable();
    }
  }

  root.querySelectorAll('input[name="lab-layout"]').forEach(function (input) {
    input.addEventListener('change', function () { state.layout = input.value; updateDesign(); });
  });
  colorInput.addEventListener('input', function () { state.color = colorInput.value; updateDesign(); });
  fontInput.addEventListener('change', function () {
    if (Object.prototype.hasOwnProperty.call(FONT_STACKS, fontInput.value)) state.font = fontInput.value;
    updateDesign();
  });
  scenarioInput.addEventListener('change', function () {
    if (!Object.prototype.hasOwnProperty.call(SCENARIOS, scenarioInput.value)) return;
    state.scenario = scenarioInput.value;
    state.phase = 'before';
    updateScenario();
    queryInput.value = SCENARIOS[state.scenario].query;
    runSearch(queryInput.value, true);
  });
  setupForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var fields = setupForm.elements;
    var next = {
      searchURL: fields.endpoint.value.trim(),
      searchAuth: fields.credential.value,
      before: fields.before.value.trim(),
      after: fields.after.value.trim(),
      rankingAfter: fields.rankingAfter.value.trim(),
    };
    fields.credential.value = '';
    if (!validSearchURL(next.searchURL) || !next.searchAuth || !next.before || !next.after || !next.rankingAfter ||
      next.before === next.after || next.rankingAfter === next.before || next.rankingAfter === next.after) {
      root.querySelector('[data-lab-setup-status]').textContent = 'Enter a valid SearchStax endpoint, read-only credential, and three different profiles.';
      return;
    }
    config = next;
    if (document.body.hasAttribute('data-lab-preview')) {
      try {
        window.sessionStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // The connection still works until this page is reloaded.
      }
    }
    setup.hidden = true;
    initialize();
  });
  filterToggle.addEventListener('change', function () {
    state.filters = filterToggle.checked;
    updateDesign();
    if (!state.filters && search && search.dataLayer.searchObject.facets.length) runSearch(queryInput.value, true);
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
    if (queryInput.value.trim()) runSearch(queryInput.value, true);
  });
  root.querySelector('[data-lab-sample]').addEventListener('click', function () { runSearch(SCENARIOS[state.scenario].query, true); });
  root.querySelector('[data-lab-share]').addEventListener('click', function () {
    copyText(sharedURL(), 'Link copied. It includes the design and comparison settings, not your search.');
  });
  root.querySelector('[data-lab-copy-css]').addEventListener('click', function () {
    copyText(starterCSS(), 'Starter CSS copied. Adjust the selectors to fit your UI Kit templates.');
  });
  root.querySelector('[data-lab-reset]').addEventListener('click', function () {
    state = { layout: 'list', filters: true, color: DEFAULT_COLOR, font: DEFAULT_FONT, scenario: 'fields', phase: 'before' };
    updateDesign();
    updateScenario();
    feedback.textContent = 'Settings reset.';
    if (search) runSearch(SCENARIOS[state.scenario].query, true);
    else queryInput.value = SCENARIOS[state.scenario].query;
  });

  readSharedSettings();
  updateDesign();
  updateScenario();
  restorePreviewConnection();
  initialize();
})();
