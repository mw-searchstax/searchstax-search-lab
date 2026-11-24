import { lessonStartEvent } from './lesson-progress';

type LabView = 'home' | 'design' | 'improve' | 'find-page' | 'promotions' | 'promotion-checklist' | 'examples' | 'spell-check' | 'ranking-guide' | 'data-filters';
export type ImproveScenario = 'missing-page' | 'synonyms' | 'flu-clinic-order' | 'facets';

export function improveScenarioForHash(hash: string): ImproveScenario | undefined {
  switch (hash) {
    case '#lab-search-fields':
    case '#lab-missing-page':
    case '#lab-missing-page-takeaway':
    case '#lab-missing-page-steps': return 'missing-page';
    case '#lab-synonyms': return 'synonyms';
    case '#lab-facets-example': return 'facets';
    case '#lab-flu-clinic-order':
    case '#lab-clinic-promotion': return 'flu-clinic-order';
  }
}

function hasSharedDesign(url: URL) {
  return ['lab_layout', 'lab_color', 'lab_font', 'lab_filters'].some(key => url.searchParams.has(key));
}

function viewFromURL(url: URL, previous?: LabView): LabView {
  if (improveScenarioForHash(url.hash)) return 'improve';
  switch (url.hash) {
    case '#lab-home': return 'home';
    case '#lab-improve': return 'improve';
    case '#lab-design-controls':
    case '#lab-more-settings':
    case '#lab-filters':
    case '#lab-design': return 'design';
    case '#lab-spell-check': return 'spell-check';
    case '#lab-data-filters': return 'data-filters';
    case '#lab-find-page': return 'find-page';
    case '#lab-promotions': return 'promotions';
    case '#lab-promotion-teammate':
    case '#lab-promotion-checklist': return 'promotion-checklist';
    case '#lab-ranking-guide':
    case '#lab-ranking-steps': return 'ranking-guide';
    case '#lab-ranking':
    case '#lab-compare-ranking':
    case '#lab-examples': return 'examples';
    case '#lab-preview':
      if (previous === 'design' || previous === 'examples') return previous;
      return url.searchParams.has('lab_scenario') ? 'examples' : 'design';
  }

  const params = url.searchParams;
  if (params.has('lab_scenario') || params.has('lab_view')) return 'examples';
  if (hasSharedDesign(url)) return 'design';
  return 'home';
}

export function setupLabNavigation(root: HTMLElement, activate: (view: LabView, hash: string) => void) {
  root.toggleAttribute('data-lab-embedded', window.self !== window.top);
  const screens = root.querySelectorAll<HTMLElement>('[data-lab-screen]');
  const designElements = root.querySelectorAll<HTMLElement>('[data-lab-design-only]');
  const exampleElements = root.querySelectorAll<HTMLElement>('[data-lab-example-only]');
  const controls = root.querySelector<HTMLElement>('.search-lab__controls')!;
  const preview = root.querySelector<HTMLElement>('#lab-preview')!;
  const designSwitch = root.querySelector<HTMLElement>('.search-lab__design-switch')!;
  const modes = [...designSwitch.querySelectorAll<HTMLButtonElement>('button')];
  const stacked = window.matchMedia('(max-width: 850px)');

  const editorTabs = [...controls.querySelectorAll<HTMLButtonElement>('.search-lab__editor-tabs [role="tab"]')];
  const featuresTab = editorTabs[0];
  const appearanceTab = editorTabs[1];

  function selectEditorTab(active: HTMLButtonElement) {
    for (const tab of editorTabs) {
      const selected = tab === active;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')!)!.hidden = !selected;
    }
  }

  for (const tab of editorTabs) {
    tab.addEventListener('click', () => selectEditorTab(tab));
    tab.addEventListener('keydown', event => {
      let next: HTMLButtonElement;
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowLeft': next = tab === featuresTab ? appearanceTab : featuresTab; break;
        case 'Home': next = featuresTab; break;
        case 'End': next = appearanceTab; break;
        default: return;
      }
      event.preventDefault();
      selectEditorTab(next);
      next.focus();
    });
  }

  for (const link of controls.querySelectorAll<HTMLButtonElement>('[data-placement-target]')) {
    link.addEventListener('click', () => {
      const field = document.getElementById(link.dataset.placementTarget!)!;
      selectEditorTab(appearanceTab);
      field.closest('details')!.open = true;
      field.focus();
    });
  }

  function setDesignMode(mode: 'edit' | 'preview') {
    root.dataset.labDesignMode = mode;
    for (const button of modes) {
      button.setAttribute('aria-pressed', String(button.dataset.labDesignMode === mode));
    }
  }

  let lastEdit: HTMLElement | undefined;
  controls.addEventListener('input', event => {
    if (event.target instanceof HTMLElement) lastEdit = event.target;
  });

  for (const button of modes) {
    button.addEventListener('click', () => {
      const mode = button.dataset.labDesignMode === 'edit' ? 'edit' : 'preview';
      if (mode === root.dataset.labDesignMode) return;
      setDesignMode(mode);
      if (mode === 'edit' && lastEdit?.checkVisibility()) {
        lastEdit.focus({ preventScroll: true });
        lastEdit.scrollIntoView({ block: 'center' });
      } else {
        (mode === 'edit' ? controls : preview).scrollIntoView({ block: 'start' });
      }
    });
  }

  const filterToggles = root.querySelectorAll<HTMLButtonElement>('.search-lab__filter-toggle');
  for (const toggle of filterToggles) {
    const options = document.getElementById(toggle.getAttribute('aria-controls')!)!;
    const label = toggle.querySelector('span')!;
    function updateFilterCount() {
      const active = options.querySelectorAll('input:checked:not([data-customer-facet][value=""]), select option:checked:not([value=""])').length;
      label.textContent = active ? ` (${active})` : '';
    }
    toggle.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', String(toggle.getAttribute('aria-expanded') !== 'true'));
    });
    options.addEventListener('change', updateFilterCount);
    new MutationObserver(updateFilterCount).observe(options, { childList: true, subtree: true });
  }

  root.querySelector('[data-lab-reset]')!.addEventListener('click', () => {
    selectEditorTab(featuresTab);
    lastEdit = undefined;
    setDesignMode('preview');
    for (const toggle of filterToggles) toggle.setAttribute('aria-expanded', 'false');
  });

  stacked.addEventListener('change', () => {
    if (root.dataset.labView !== 'design') return;
    const focused = document.activeElement;
    if (stacked.matches && controls.contains(focused)) setDesignMode('edit');
    if (stacked.matches && preview.contains(focused)) setDesignMode('preview');
    if (!stacked.matches && designSwitch.contains(focused)) {
      const target = root.dataset.labDesignMode === 'edit'
        ? root.querySelector<HTMLElement>('#lab-design-controls')!
        : preview;
      target.focus({ preventScroll: true });
    }
  });

  let previous: LabView | undefined;
  let previousHash = '';

  function showView(focus: boolean) {
    const url = new URL(window.location.href);
    const view = viewFromURL(url, previous);
    const changedView = view !== previous;
    const changedExample = view === 'examples' && url.hash !== previousHash && url.hash !== '#lab-preview';
    if (view === 'design') {
      if (['#lab-design-controls', '#lab-more-settings', '#lab-filters'].includes(url.hash)) {
        selectEditorTab(featuresTab);
        setDesignMode('edit');
      } else if (url.hash === '#lab-preview') setDesignMode('preview');
      else if (changedView) {
        lastEdit = undefined;
        setDesignMode(previous !== 'home' && hasSharedDesign(url) ? 'preview' : 'edit');
      }
    }
    previousHash = url.hash;
    if (changedView) {
      const screenName = view === 'examples' || view === 'design' ? 'workspace' : view;
      const startsLesson = previous === 'home' || previous === 'improve';
      for (const screen of screens) {
        screen.hidden = screen.dataset.labScreen !== screenName;
        if (!screen.hidden && startsLesson) {
          screen.dispatchEvent(new Event(lessonStartEvent));
        }
      }
      for (const element of designElements) element.hidden = view !== 'design';
      for (const element of exampleElements) element.hidden = view !== 'examples';
      previous = view;
      root.dataset.labView = view;
    }
    if (changedView || changedExample || view === 'improve') activate(view, url.hash);

    if (focus) {
      const anchor = document.getElementById(url.hash.slice(1));
      const heading = document.getElementById(`lab-${view}`);
      const target = anchor && root.contains(anchor) ? anchor : heading;
      const disclosure = target?.closest('details');
      for (let parent = disclosure; parent; parent = parent.parentElement?.closest('details')) {
        parent.open = true;
      }
      if (url.hash === '#lab-improve' && stacked.matches) {
        // Bring the entire introduction into the article viewport before focusing its heading.
        heading?.closest('header')?.focus();
      }
      target?.focus({ preventScroll: true });
      if (target === heading) window.scrollTo(0, 0);
      else if (disclosure) target?.scrollIntoView({ block: 'center' });
      else target?.scrollIntoView({ block: stacked.matches && target.matches('h2') ? 'nearest' : 'start' });
    }
  }

  window.addEventListener('hashchange', () => showView(true));
  showView(Boolean(window.location.hash));

  return function showDesignPreview() {
    if (stacked.matches) setDesignMode('preview');
  };
}
