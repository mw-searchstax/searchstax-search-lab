import { setupPublishedFacets, type FacetSelection } from './published-facets.js';
import { DEFAULT_DESIGN, type DesignSettings } from './design.js';
import { setupProfileFeatures, orderDirectoryResults, spanishPromotionQuery } from './profile-features.js';
import { demoSortOptions } from './demo-sorting.js';
import { contentLanguageTag } from './content-language.js';
import { createSearchRecovery } from './search-recovery.js';
import { searchBuildApp, CustomerSearchError, type BuildPage, type CustomerConnection } from './customer-search.js';

import { profileStatus, type Entitlements, type Profile } from './app-configuration.js';
import { resultMappingNotice, appendResultCard, mapResultCard, type ResultCard } from './result-card.js';

export type Experience = Profile;

export type ExperienceHandoff = {
  source: 'app' | 'demo';
  entitlements?: Entitlements;
  profiles: Experience[];
  defaultLanguage: string;
  selected: Experience;
  initialQuery: string;
};

const demoBase = 'https://mw-searchstax.github.io/university-health-search-demo/';
const directory = [
  { section: 'programs', topic: ['Nursing', 'Enfermería'], path: 'education/nursing-simulation/', enrollment: true, published: '2026-03-16', en: ['Nursing Simulation', 'Explore campus classroom exercises, equipment and observation logs.'], es: ['Simulación de enfermería', 'Explora los ejercicios de aula, los materiales y los registros de observación del campus.'] },
  { section: 'programs', topic: ['Public health', 'Salud pública'], path: 'education/public-health/', en: ['Public Health', 'Explore campus coursework on population health and community education.'], es: ['Salud pública', 'Conoce los cursos del campus sobre salud de la población y educación comunitaria.'] },
  { section: 'locations', topic: ['North campus', 'Campus norte'], path: 'locations/north-campus-clinic/', en: ['North Campus Clinic', 'Find the teaching annex for primary care and neurology.'], es: ['Clínica del campus norte', 'Consulta la sede docente de atención primaria y neurología.'] },
  { section: 'locations', topic: ['South campus', 'Campus sur'], path: 'locations/south-campus-clinic/', en: ['South Campus Clinic', 'Explore the teaching annex with illustration displays and seminar rooms.'], es: ['Clínica del campus sur', 'Conoce la sede docente con salas de seminarios y exposiciones de ilustraciones.'] },
  { section: 'programs', topic: ['Rehabilitation', 'Rehabilitación'], path: 'care/services/rehabilitation/', en: ['Rehabilitation', 'Explore rehabilitation, physical therapy and sports medicine coursework.'], es: ['Rehabilitación', 'Explora la formación en rehabilitación, terapia física y medicina deportiva.'] },
  { section: 'locations', topic: ['Rehabilitation', 'Rehabilitación'], path: 'locations/rehabilitation-center/', en: ['Rehabilitation Center', 'See the rehabilitation center’s physical therapy teaching space.'], es: ['Centro de rehabilitación', 'Conoce el espacio docente de terapia física del centro de rehabilitación.'] },
  { section: 'programs', topic: ['Orthopedics', 'Ortopedia'], path: 'care/services/orthopedics/', en: ['Orthopedics', 'Explore joint models and illustrated teaching materials.'], es: ['Ortopedia', 'Explora modelos articulares y materiales de enseñanza ilustrados.'] },
  { section: 'shared', topic: ['Flu clinic', 'Clínica de gripe'], path: 'news/flu-clinic-update-2024/', published: '2024-09-15', en: ['Flu Clinic Updates — 2024 Archive', 'Archived campus flu clinic teaching notices.'], es: ['Clínica de gripe — Archivo de 2024', 'Avisos anteriores de la clínica de gripe del campus.'] },
  { section: 'shared', topic: ['Flu clinic', 'Clínica de gripe'], path: 'news/flu-clinic-update-2026/', published: '2026-09-15', en: ['Flu Clinic Updates — 2026 Notice', 'The current campus flu clinic notice.'], es: ['Clínica de gripe — Aviso de 2026', 'El aviso actual de la clínica de gripe del campus.'] },
];
export const demoProfiles = [
  { language: 'en', profile: 'Programs', section: 'programs' },
  { language: 'en', profile: 'Locations', section: 'locations' },
  { language: 'es', profile: 'Programas', section: 'programs' },
  { language: 'es', profile: 'Ubicaciones', section: 'locations' },
].map(item => ({ ...item, relatedSearches: item.section !== 'locations', smartAnswers: item.section === 'programs', highlighting: item.section === 'programs' }));

function searchDirectory(active: Experience, query: string, tabs: boolean, filters: FacetSelection, mode: DesignSettings['facetMode']) {
  const spanish = active.language === 'es';
  const scope = demoProfiles.find(item => item.language === active.language && item.profile === active.profile);
  const items = directory.filter(doc => !tabs || doc.section === scope?.section || doc.section === 'shared').map(doc => {
    const [title, description] = spanish ? doc.es : doc.en;
    const type = demoProfiles.find(item => item.language === active.language && item.section === doc.section)?.profile ?? (spanish ? 'Avisos' : 'Notices');
    return { title, description, url: demoBase + doc.path, type, topic: doc.topic[spanish ? 1 : 0],
      enrollment: doc.enrollment, published: doc.published };
  }).filter(doc => query.toLocaleLowerCase().split(/\s+/).every(word => (doc.title + ' ' + doc.description).toLocaleLowerCase().includes(word)));
  const field = tabs ? 'topic' : 'type';
  const valueOf = (doc: typeof items[number]) => tabs ? doc.topic : doc.type;
  const selected = filters.get(field) ?? [];
  const entries = items.filter(doc => mode === 'and' ? selected.every(value => value === valueOf(doc))
    : !selected.length || selected.includes(valueOf(doc)));
  const counts = new Map<string, number>();
  for (const doc of entries) counts.set(valueOf(doc), (counts.get(valueOf(doc)) ?? 0) + 1);
  return { entries, total: entries.length, facets: [{ field, label: tabs ? (scope?.section === 'locations' ? 'Campus' : (spanish ? 'Área de estudio' : 'Field of study')) : (spanish ? 'Tipo de contenido' : 'Content type'),
    choices: [...counts].map(([value, count]) => ({ value, count })) }] };
}

function directoryCards(entries: (ReturnType<typeof searchDirectory>['entries'][number] & { promoted?: boolean })[],
  profile: Profile, query: string, thumbnails: Record<string, string>) {
  const locations = demoProfiles.find(item => item.profile === profile.profile)?.section === 'locations';
  const fields = [
    { name: 'title', result_card: 'title' }, { name: 'url', result_card: 'url' },
    { name: 'description', result_card: 'description' }, { name: 'type', result_card: locations ? 'paths' : 'ribbon' },
    { name: 'published', result_card: 'date', title: profile.language === 'es' ? 'Fecha de publicación' : 'Published' },
    { name: 'enrollment', result_card: '', title: profile.language === 'es' ? 'Inscripción abierta' : 'Open for enrollment' },
    { name: 'topic', result_card: '', title: profile.language === 'es' ? 'Tema' : 'Topic' },
  ];
  return entries.map(entry => {
    const card = mapResultCard(entry, fields);
    if (profile.highlighting) {
      for (const field of card.values) {
        const at = field.value.toLocaleLowerCase().indexOf(query.toLocaleLowerCase());
        if (at < 0) continue;
        const text = field.value;
        field.value = text.slice(0, at) + '<em>' + text.slice(at, at + query.length) + '</em>' + text.slice(at + query.length);
        field.highlighted = true;
      }
    }
    card.promoted = Boolean(entry.promoted);
    // These URLs are bundled fixture images. Connected cards use their mapped thumbnail field.
    card.thumbnail = thumbnails[entry.url] ?? '';
    return card;
  });
}

export function experienceHandoff(connected = false, catalog: Experience[] = demoProfiles, active = catalog[0], query = 'campus', defaultLanguage = demoProfiles[0].language): ExperienceHandoff {
  return {
    source: connected ? 'app' : 'demo',
    defaultLanguage,
    profiles: catalog.map(({ language, profile, relatedSearches, smartAnswers, highlighting }) => ({ language, profile, relatedSearches, smartAnswers, highlighting })),
    selected: { language: active.language, profile: active.profile },
    initialQuery: connected ? '' : query,
  };
}

const languageName = (code: string) => {
  if (!code) return 'App default language';
  const tag = contentLanguageTag(code);
  if (!tag) return code;
  try { return new Intl.DisplayNames(['en'], { type: 'language' }).of(tag) || code; }
  catch { return code; }
};

export function setupExperiencePreview(panel: HTMLElement, thumbnails: Record<string, string>) {
  const field = <T extends HTMLElement>(selector: string) => panel.querySelector<T>(selector)!;
  const language = field<HTMLSelectElement>('[data-exp-language] select');
  const tabs = field('[role="tablist"]');
  const results = field('[role="tabpanel"]');
  const list = field('.experience-results ul');
  const status = results.querySelector<HTMLElement>('[role="status"]')!;
  const input = field<HTMLInputElement>('input[type="search"]');
  const previous = field<HTMLButtonElement>('[data-exp-prev]');
  const next = field<HTMLButtonElement>('[data-exp-next]');
  const pages = field('[data-exp-pages]');
  const loadMore = document.createElement('button');
  loadMore.type = 'button';
  loadMore.textContent = DEFAULT_DESIGN.loadMoreText;
  loadMore.hidden = true;
  pages.append(loadMore);
  status.tabIndex = -1;
  const info = field('[data-exp-source]');
  let app: CustomerConnection | null = null;
  let allProfiles: Experience[] = demoProfiles;
  let tabProfiles = allProfiles;
  let catalog = allProfiles;
  let active = catalog[0];
  let defaultLanguage = demoProfiles[0].language;
  let startingProfile: Experience | undefined = active;
  function profileForLanguage(code: string, preferred?: Experience): Experience {
    const choices = catalog.filter(item => item.language === code);
    return choices.find(item => item.profile === preferred?.profile)
      ?? choices.find(item => item.profile === startingProfile?.profile && item.language === startingProfile.language)
      ?? choices[0] ?? { language: code, profile: '' };
  }
  let query = 'campus';
  let start = 0;
  let displayedStart = 0;
  const searchForm = field<HTMLFormElement>('form');
  let lastAnchor: HTMLElement = searchForm;
  let lastControl: HTMLElement = input;
  const recovery = createSearchRecovery(input, () => { void search(lastAnchor, lastControl); });
  let options: DesignSettings = { ...DEFAULT_DESIGN };
  let filters: FacetSelection = new Map();
  const facets = field('[data-exp-facets]');
  const filterPanel = field('[data-exp-filter-panel]');
  const filterButton = field<HTMLButtonElement>('[data-exp-filter-toggle]');
  const order = field<HTMLSelectElement>('[data-exp-sort] select');
  const empty = field('[data-exp-empty]');
  let sorts: BuildPage['sorts'] = [];
  let noMatches = false;
  let mappingNotice = '';
  let highlighting: boolean | undefined;
  const features = setupProfileFeatures(panel, submit);
  const spanish = () => active.language.split(/[-_]/)[0] === 'es';
  const paginationMode = () => options.paginationMode;

  function updatePresentation() {
    const es = spanish();
    const fieldText = es && options.searchFieldText === DEFAULT_DESIGN.searchFieldText ? 'Buscar en el sitio' : options.searchFieldText;
    input.placeholder = fieldText;
    field('form label').textContent = fieldText;
    field('form').setAttribute('aria-label', fieldText);
    field('button[type="submit"]').textContent = es && options.searchButtonText === DEFAULT_DESIGN.searchButtonText ? 'Buscar' : options.searchButtonText;
    empty.textContent = es && options.noResultsText === DEFAULT_DESIGN.noResultsText ? 'No hay coincidencias. Prueba otra búsqueda o quita un filtro.' : options.noResultsText;
    if (mappingNotice) empty.textContent = mappingNotice;
    empty.hidden = !noMatches && !mappingNotice;
    previous.textContent = es ? 'Página anterior' : 'Previous page';
    next.textContent = es ? 'Página siguiente' : 'Next page';
    loadMore.textContent = es && options.loadMoreText === DEFAULT_DESIGN.loadMoreText ? 'Cargar más' : options.loadMoreText;
    const selectedCount = Array.from(filters.values()).reduce((count, values) => count + values.length, 0);
    filterButton.textContent = (es ? 'Filtros' : 'Filters') + (selectedCount ? ' (' + selectedCount + ')' : '');
    field('[data-exp-sort] span').textContent = es ? 'Ordenar por' : 'Sort by';
    field('[data-exp-sort]').hidden = !options.showSorting || !sorts.length;
    field('[data-exp-sort-hint]').hidden = !app || !active.profile || !options.showSorting || Boolean(sorts.length);
    if (active.profile) features.update(options, app, active, query);
    else features.clear();
  }

  filterButton.addEventListener('click', () => {
    filterButton.setAttribute('aria-expanded', String(filterButton.getAttribute('aria-expanded') !== 'true'));
  });
  order.addEventListener('change', () => { start = 0; void search(field('[data-exp-sort]'), order); });

  const facetView = setupPublishedFacets(facets, () => options, (next, label, input) => {
    filters = next;
    start = 0;
    void search(label, input);
  });
  function showFacets(fields: BuildPage['facets']) {
    facetView.render(options.filters ? fields : [], filters);
    filterPanel.hidden = !facets.childElementCount;
  }
  let pending: AbortController | undefined;

  function cancelSearch() {
    pending?.abort();
    pending = undefined;
    results.removeAttribute('aria-busy');
  }
  async function search(anchor = searchForm as HTMLElement, control = input as HTMLElement) {
    cancelSearch();
    lastAnchor = anchor;
    lastControl = control;
    recovery.begin(anchor, control);
    noMatches = false;
    mappingNotice = '';
    updatePresentation();
    features.showExternalPromotions([]);
    const append = paginationMode() === 'loadMore' && anchor === pages && list.childElementCount > 0;
    const keepPagedResults = paginationMode() === 'paged' && anchor === pages;
    if (!append && !keepPagedResults) list.replaceChildren();
    if (!options.filters || !query || app && (!app.endpoint || !app.token)) showFacets([]);
    if (anchor !== pages) pages.hidden = true;
    if (!active.profile) {
      status.textContent = active.language ? 'No profiles are included for ' + languageName(active.language) + '.'
        : 'The default profile’s language is unknown.';
      return;
    }
    if (app && (!app.endpoint || !app.token)) {
      status.textContent = 'To search your app, set the Select endpoint and read-only token in src/config.js.';
      return;
    }
    const es = spanish();
    if (!query) { status.textContent = es ? 'Escribe un término de búsqueda.' : 'Enter a search term.'; return; }
    const request = new AbortController();
    pending = request;
    results.setAttribute('aria-busy', 'true');
    status.textContent = 'Searching…';
    try {
      let cards: ResultCard[];
      let choices = demoSortOptions.slice(1).map(({ order, label }) => ({
        value: order, label: es ? label.replace('Page address', 'Dirección de página') : label,
      }));
      let banners: BuildPage['externalPromotions'] = [];
      let fields: BuildPage['facets'];
      const rows = options.resultsPerPage;
      let total: number;
      if (app) {
        const page = await searchBuildApp({ ...app, ...active, settings: active }, { query, start, rows, sort: options.showSorting ? order.value : '', filters: new Map(filters), facetMode: options.facetMode }, AbortSignal.any([request.signal, AbortSignal.timeout(12000)]));
        if (pending !== request) return;
        mappingNotice = resultMappingNotice(page.mappingsKnown, page.cards.length, page.total);
        highlighting = page.highlighting;
        choices = page.sorts;
        banners = page.externalPromotions;
        fields = page.facets;
        cards = page.cards;
        total = page.total;
      } else {
        const samplePage = searchDirectory(active, query, options.profileTabs, filters, options.facetMode);
        const matches = orderDirectoryResults(samplePage.entries, options.showSorting ? order.value : '', query, options.samplePromotions);
        cards = directoryCards(matches.slice(start, start + rows), active, query, thumbnails);
        total = samplePage.total;
        fields = samplePage.facets;
      }
      if (pending !== request) return;
      recovery.clear();
      displayedStart = start;
      if (!append) list.replaceChildren();
      sorts = choices;
      const selected = order.value;
      order.replaceChildren(new Option(es ? 'Relevancia' : 'Relevance', ''), ...sorts.map(choice => new Option(choice.label, choice.value)));
      if (sorts.some(choice => choice.value === selected)) order.value = selected;
      noMatches = total === 0;
      updatePresentation();
      features.showExternalPromotions(banners);
      showFacets(fields);
      for (const card of cards) {
        const item = document.createElement('li');
        if (card.promoted) {
          const marker = document.createElement('strong');
          marker.className = app ? 'search-promotion-marker' : 'sample-indexed-promotion';
          marker.dataset.defaultLabel = es ? (app ? 'Promocionado' : 'Promoción indexada de ejemplo') : (app ? 'Promoted' : 'Sample indexed promotion');
          marker.textContent = options.promotionBadge === DEFAULT_DESIGN.promotionBadge ? marker.dataset.defaultLabel : options.promotionBadge;
          item.append(marker);
        }
        appendResultCard(item, card);
        const link = item.querySelector('a');
        if (link) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          if (!app) link.hreflang = 'en';
        }
        list.append(item);
      }
      reportSettings();
      list.lang = contentLanguageTag(active.language) || '';
      const loaded = list.children.length;
      const range = total > rows ? (append ? '1–' + loaded : (start + 1) + '–' + Math.min(start + rows, total)) + (es ? ' de ' : ' of ') : '';
      const count = es ? (total === 1 ? ' resultado para ' : ' resultados para ') : (total === 1 ? ' result for ' : ' results for ');
      status.textContent = total ? range + total + count + '“' + query + '”' : (es ? 'Sin resultados para ' : 'No results for ') + '“' + query + '”.';
      const moreAvailable = start + rows < total;
      const loadingMore = paginationMode() === 'loadMore';
      previous.hidden = loadingMore;
      next.hidden = loadingMore;
      previous.disabled = start === 0;
      next.disabled = moreAvailable ? false : true;
      loadMore.hidden = !loadingMore || !moreAvailable;
      if (loadingMore && !moreAvailable && append) status.textContent = es ? 'Se cargaron los ' + total + ' resultados' : 'All ' + total + ' results loaded';
      pages.hidden = total === 0 || (total <= rows && !loadingMore);
      if (document.activeElement === loadMore) (loadMore.hidden ? status : loadMore).focus({ preventScroll: true });
    } catch (error) {
      if (pending !== request) return;
      status.textContent = anchor === pages ? (es ? 'Resultados de la página anterior.' : 'Showing the previous page.') : '';
      const message = error instanceof CustomerSearchError ? error.message
        : es ? 'No se pudo cargar la búsqueda. Inténtalo de nuevo.' : 'Couldn’t load this search. Try again.';
      recovery.error(message, es ? 'Volver a intentar' : 'Retry search');
    } finally {
      if (pending === request) { results.removeAttribute('aria-busy'); pending = undefined; }
    }
  }
  function reportSettings() {
    const entitlements = app ? app.configuration?.entitlements ?? {} : { relatedSearches: true, smartAnswers: true };
    panel.dispatchEvent(new CustomEvent('profile-settings', { detail: {
      profile: active, entitlements, highlighting, summary: profileStatus(entitlements, active, highlighting, app ?? undefined),
    } }));
  }

  function select(item: Experience, focus = false, fromLanguage = false) {
    active = item;
    highlighting = active.highlighting;
    reportSettings();
    order.replaceChildren();
    filterButton.setAttribute('aria-expanded', 'false');
    sorts = [];
    filters.clear();
    facetView.reset();
    filterPanel.hidden = true;
    start = 0;
    const choices = catalog.filter(choice => choice.profile && choice.language === active.language);
    tabs.replaceChildren(...choices.map(choice => {
      const button = document.createElement('button');
      button.type = 'button';
      button.id = 'lab-experience-tab-' + catalog.indexOf(choice);
      button.textContent = choice.profile;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', results.id);
      button.setAttribute('aria-selected', String(choice === active));
      button.tabIndex = choice === active ? 0 : -1;
      button.addEventListener('click', () => select(choice, true));
      button.addEventListener('keydown', event => {
        const index = choices.indexOf(choice);
        const targets: Record<string, number> = { ArrowLeft: (index + choices.length - 1) % choices.length, ArrowRight: (index + 1) % choices.length, Home: 0, End: choices.length - 1 };
        if (Object.hasOwn(targets, event.key)) { event.preventDefault(); select(choices[targets[event.key]], true); }
      });
      return button;
    }));
    const selected = tabs.querySelector<HTMLButtonElement>('[aria-selected="true"]');
    tabs.hidden = !options.profileTabs || !choices.length;
    results.setAttribute('role', options.profileTabs && selected ? 'tabpanel' : 'region');
    if (options.profileTabs && selected) {
      results.removeAttribute('aria-label');
      results.setAttribute('aria-labelledby', selected.id);
    } else {
      results.removeAttribute('aria-labelledby');
      results.setAttribute('aria-label', 'Search results');
    }
    if (focus) selected?.focus();
    if (fromLanguage) void search(field('[data-exp-language]'), language);
    else if (focus && selected) void search(tabs, selected);
    else void search();
  }
  function render(fromLanguage = false) {
    const languages = [...new Set(allProfiles.map(item => item.language).filter(Boolean))];
    if (active.language && !languages.includes(active.language)) languages.unshift(active.language);
    language.replaceChildren(...languages.map(code => new Option(!app && code === 'es' ? 'Español' : languageName(code), code)));
    if (!defaultLanguage) language.prepend(new Option('Choose a language', ''));
    language.value = active.language;
    language.disabled = language.options.length < 2;
    field('[data-exp-language]').hidden = !options.languagePicker;
    const es = spanish();
    field('[data-exp-language] span').textContent = es ? 'Idioma de búsqueda' : 'Search language';
    info.textContent = !app && active.language === 'es' ? 'Los enlaces abren páginas del campus en inglés.' : '';
    if (app && active.profile && !options.profileTabs) info.textContent = 'Search Profile: ' + active.profile;
    info.hidden = !info.textContent;
    select(active, false, fromLanguage);
  }
  language.addEventListener('change', () => {
    const section = !app && demoProfiles.find(item => item.language === active.language && item.profile === active.profile)?.section;
    const translated = section && demoProfiles.find(item => item.language === language.value && item.section === section);
    active = profileForLanguage(language.value, translated || active);
    render(true);
  });
  function submit(term: string) {
    query = term.trim();
    input.value = term;
    filters.clear();
    facetView.reset();
    start = 0;
    void search();
  }
  field('form').addEventListener('submit', event => { event.preventDefault(); submit(input.value); });
  previous.addEventListener('click', () => { start = Math.max(0, displayedStart - options.resultsPerPage); void search(pages, previous); });
  next.addEventListener('click', () => { start = displayedStart + options.resultsPerPage; void search(pages, next); });
  loadMore.addEventListener('click', () => {
    if (pending || paginationMode() !== 'loadMore') return;
    start = displayedStart + options.resultsPerPage;
    void search(pages, loadMore);
  });
  return {
    open(term = query, draft = term) { query = term; input.value = draft; render(); },
    close() { cancelSearch(); recovery.clear(); features.clear(); },
    setProfiles(choices: Experience[]) {
      if (!choices.length) return;
      tabProfiles = choices;
      if (!options.profileTabs) return;
      catalog = tabProfiles;
      active = profileForLanguage(active.language, active);
      if (!panel.hidden) render();
    },
    get searchState() { return { query, draft: input.value }; },
    submit,
    get spanishDemo() { return !app && spanish(); },
    get promotionQuery() { return spanish() ? spanishPromotionQuery : 'campus flu clinic'; },
    configure(design: DesignSettings) {
      const previous = options;
      options = { ...design };
      catalog = options.profileTabs ? tabProfiles : allProfiles;
      const code = design.languagePicker ? active.language : defaultLanguage;
      const leavingTabs = previous.profileTabs && !design.profileTabs;
      if (leavingTabs || active.language !== code) active = profileForLanguage(code);
      else if (!catalog.includes(active)) active = profileForLanguage(code, active);
      panel.dataset.layout = design.layout;
      panel.dataset.filterPlacement = design.filterPlacement;
      panel.dataset.filterStyle = design.topFilterStyle;
      panel.dataset.descriptions = String(Boolean(app) || design.showDescriptions);
      panel.dataset.thumbnails = String(design.showThumbnails);
      panel.dataset.dividers = String(design.listDividers);
      panel.dataset.underline = String(design.underlineTitles);
      facetView.refresh();
      if (panel.hidden) return;
      if (previous.profileTabs !== design.profileTabs || previous.languagePicker !== design.languagePicker) {
        render();
      } else if (previous.facetMode !== design.facetMode || previous.filters !== design.filters || previous.resultsPerPage !== design.resultsPerPage ||
                 previous.paginationMode !== design.paginationMode ||
                 previous.showSorting !== design.showSorting || previous.samplePromotions !== design.samplePromotions) {
        start = 0;
        if (!design.filters || previous.facetMode !== design.facetMode) filters.clear();
        if (!design.showSorting || previous.samplePromotions !== design.samplePromotions) order.value = '';
        void search();
      } else updatePresentation();
    },
    handoff(): ExperienceHandoff {
      return { ...experienceHandoff(Boolean(app), catalog, active, query, defaultLanguage), entitlements: app?.configuration?.entitlements };
    },
    setSource(connection: CustomerConnection | null, choices: Experience[], term: string, selected?: Experience, sourceLanguage?: string) {
      cancelSearch(); features.clear(); app = connection;
      allProfiles = choices.length ? choices : connection ? [connection.settings ?? { language: connection.language, profile: connection.profile }] : demoProfiles;
      tabProfiles = allProfiles;
      catalog = allProfiles;
      defaultLanguage = sourceLanguage ?? (connection ? connection.language || selected?.language || '' : demoProfiles[0].language);
      startingProfile = connection?.settings ?? (!connection ? demoProfiles[0] : undefined);
      const code = options.languagePicker ? selected?.language ?? defaultLanguage : defaultLanguage;
      active = profileForLanguage(code, selected?.language === code ? selected : undefined);
      panel.dataset.descriptions = String(Boolean(app) || options.showDescriptions);
      query = term;
      start = 0;
      list.replaceChildren(); tabs.replaceChildren(); language.replaceChildren();
      input.value = term; info.textContent = ''; status.textContent = ''; pages.hidden = true;
      if (!panel.hidden) render();
    },
  };
}
