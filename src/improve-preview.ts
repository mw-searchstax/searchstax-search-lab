import { readCustomerEndpoint, searchCustomerApp, type CustomerConnection, type CustomerPage } from './customer-search';
import { demoResultText, demoResultTitle } from './demo-content.js';
import { setupVisitorSearch } from './improve-visitor-search';
import { lessonStartEvent } from './lesson-progress';
import { improveScenarioForHash, type ImproveScenario } from './navigation';

type Lesson = 'missing-page' | 'flu-clinic-order';
type Result = CustomerPage['results'][number];
type ResultHighlight = { kind: 'added' | 'moved' | 'retained'; label?: string };
type Outcome = { highlights: Map<string, ResultHighlight>; heading: string; detail: string; explanation?: string };

const resultLimit = 5;
const queries = { 'missing-page': 'travel vaccinations', 'flu-clinic-order': 'campus flu clinic' };
const internationalHealthPath = '/university-health-search-demo/care/services/international-health/';
const currentNoticePath = '/university-health-search-demo/news/flu-clinic-update-2026/';
const northCampusPath = '/university-health-search-demo/locations/north-campus-clinic/';
const demoSite = 'https://mw-searchstax.github.io/university-health-search-demo/';
const newMatch: ResultHighlight = { kind: 'added', label: 'New match' };
const keptByFilter: ResultHighlight = { kind: 'retained', label: 'Kept by filter' };

function previewResults(page: CustomerPage) {
  return Array.from(new Map(page.results.map(result => [result.url, result])).values()).slice(0, resultLimit);
}

function explainChange(lesson: Lesson, baseline: CustomerPage, before: Result[], after: Result[]): Outcome | undefined {
  if (lesson === 'missing-page') {
    const added = after.find(result => new URL(result.url).pathname === internationalHealthPath);
    if (added && baseline.total <= before.length && !before.some(result => result.url === added.url)) {
      return {
        highlights: new Map([[added.url, newMatch]]),
        heading: 'International Health appears',
        detail: 'Search skipped the service name. Adding it lets the same search match “Travel Vaccinations” on this page.',
      };
    }
    return;
  }

  const sameFive = before.length === resultLimit && after.length === resultLimit
    && after.every(result => before.some(previous => previous.url === result.url));
  if (!sameFive) return;
  const clinicBefore = before.findIndex(result => new URL(result.url).pathname === northCampusPath);
  const clinicAfter = after.findIndex(result => new URL(result.url).pathname === northCampusPath);
  const noticeBefore = before.findIndex(result => new URL(result.url).pathname === currentNoticePath);
  const noticeAfter = after.findIndex(result => new URL(result.url).pathname === currentNoticePath);
  if (clinicAfter < 0 || clinicAfter >= clinicBefore || noticeBefore < 0 || noticeAfter < 0) return;

  const clinicMove = `North Campus Clinic moved from #${clinicBefore + 1} to #${clinicAfter + 1}.`;
  const noticeMove = noticeBefore === noticeAfter
    ? `This year’s notice stayed at #${noticeAfter + 1}.`
    : `This year’s notice moved from #${noticeBefore + 1} to #${noticeAfter + 1}.`;
  const highlights = new Map<string, ResultHighlight>([
    [after[clinicAfter].url, { kind: 'moved', label: `#${clinicBefore + 1} → #${clinicAfter + 1}` }],
  ]);
  if (noticeBefore !== noticeAfter) {
    highlights.set(after[noticeAfter].url, { kind: 'moved', label: `#${noticeBefore + 1} → #${noticeAfter + 1}` });
  }

  return {
    highlights,
    heading: 'Same five results, new order',
    detail: `${clinicMove} ${noticeMove} The extra weight for title matches favored the campus clinic pages.`,
    explanation: 'The extra weight for title matches favored the campus clinic pages.',
  };
}

function describeObservedChange(before: Result[], after: Result[]) {
  const added = after.filter(result => !before.some(previous => previous.url === result.url)).length;
  const removed = before.filter(previous => !after.some(result => result.url === previous.url)).length;
  if (added || removed) {
    const entered = added ? added + (added === 1 ? ' page entered' : ' pages entered') : '';
    const left = removed ? removed + (removed === 1 ? ' page left' : ' pages left') : '';
    return [entered, left].filter(Boolean).join(' and ') + ' the top results.';
  }
  return after.some((result, index) => result.url !== before[index]?.url)
    ? 'The same pages appear in a different order.'
    : 'The top results stayed the same.';
}

function resultPath(url: string) {
  const { pathname, hostname } = new URL(url);
  const base = new URL(demoSite);
  if (hostname !== base.hostname || !pathname.startsWith(base.pathname)) return hostname;
  const sections = pathname.slice(base.pathname.length).split('/').filter(Boolean).slice(0, -1);
  return ['Home', ...sections.map(slug => slug === 'care' ? 'Departments' :
    (slug.charAt(0).toUpperCase() + slug.slice(1)).replaceAll('-', ' '))].join(' / ');
}

function resultRow(url: string, showRank = false) {
  const row = document.createElement('li');
  row.className = 'improve-preview__row';
  row.setAttribute('role', 'listitem');
  const card = document.createElement('article');
  card.className = 'searchstax-search-result';
  const title = document.createElement('h4');
  const link = document.createElement('a');
  link.className = 'searchstax-search-result-title';
  link.href = url;
  title.append(link);
  const description = document.createElement('p');
  const rank = showRank ? document.createElement('span') : null;
  if (rank) {
    rank.className = 'improve-preview__rank';
    rank.setAttribute('aria-hidden', 'true');
    card.append(rank);
  }
  const badge = document.createElement('span');
  badge.className = 'improve-preview__badge';
  badge.hidden = true;
  const path = document.createElement('div');
  path.className = 'improve-preview__result-path';
  path.textContent = resultPath(url);
  card.append(path, title, description, badge);
  row.append(card);
  return { row, link, description, badge, rank };
}

function highlightResult(item: ReturnType<typeof resultRow>, highlight?: ResultHighlight) {
  if (highlight) item.row.dataset.change = highlight.kind;
  else delete item.row.dataset.change;
  item.badge.textContent = highlight?.label ?? '';
  item.badge.hidden = !highlight?.label;
}

function createCallout(title: string, text: string, results: ReturnType<typeof resultRow>[] = []) {
  const callout = document.createElement('div');
  const heading = document.createElement('strong');
  heading.textContent = title;
  const detail = document.createElement('p');
  detail.textContent = text;
  callout.append(heading, detail);
  if (results.length > 1) {
    const jumps = document.createElement('ul');
    jumps.className = 'improve-preview__takeaway-results';
    for (const item of results) {
      const row = document.createElement('li');
      const link = document.createElement('a');
      const badge = document.createElement('span');
      link.href = '#' + item.link.id;
      link.textContent = item.link.textContent;
      badge.textContent = item.badge.textContent;
      link.append(badge);
      link.addEventListener('click', event => {
        event.preventDefault();
        item.link.focus({ preventScroll: true });
        item.link.scrollIntoView({ block: 'center' });
      });
      row.append(link);
      jumps.append(row);
    }
    callout.append(jumps);
  }
  return callout;
}

function setResultPhase(phase: HTMLElement, label: 'Before change' | 'Updating…' | 'Change applied') {
  phase.textContent = label;
  phase.toggleAttribute('data-applied', label === 'Change applied');
}

function setLessonApplied(button: HTMLButtonElement, applied: boolean) {
  button.dataset.applyLabel ??= button.textContent.trim();
  button.toggleAttribute('data-applied', applied);
  button.textContent = applied ? 'Show original results' : button.dataset.applyLabel;
}

function mountPreview(section: HTMLElement, template: HTMLTemplateElement, query: string, resultsId: string, demo: CustomerConnection, appliedProfile?: string) {
  const sidebar = section.closest('.improve-workspace')!.querySelector<HTMLElement>('[data-improve-sidebar]')!;
  const chooser = sidebar.querySelector<HTMLFieldSetElement>('#lab-improve-scenario')!;
  const controls = section.querySelector<HTMLElement>('[data-improve-controls]')!;
  const toggle = section.querySelector<HTMLButtonElement>('[data-improve-toggle]')!;
  const guidance = section.querySelector<HTMLElement>('[data-improve-own-site]')!;
  const preview = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const followup = preview.querySelector<HTMLElement>('[data-improve-preview-followup]')!;
  const noteAnchor = preview.querySelector<HTMLElement>('[data-improve-note-anchor]')!;
  const takeaway = preview.querySelector<HTMLElement>('[data-improve-takeaway]')!;
  const takeawayToggle = takeaway.querySelector<HTMLButtonElement>('[data-improve-takeaway-toggle]')!;
  const callout = takeaway.querySelector<HTMLElement>('[data-improve-callout]')!;
  const next = preview.querySelector<HTMLElement>('[data-improve-next]')!;
  const ownSiteToggle = next.querySelector<HTMLButtonElement>('[data-improve-own-site-toggle]')!;
  const chooseScenario = next.querySelector<HTMLButtonElement>('[data-improve-choose]')!;
  chooseScenario.addEventListener('click', () => {
    chooser.querySelector<HTMLInputElement>('input:checked')?.focus({ preventScroll: true });
    chooser.scrollIntoView({ block: 'center' });
  });
  const list = preview.querySelector<HTMLOListElement>('[data-improve-results]')!;
  const count = preview.querySelector<HTMLElement>('[data-improve-count]')!;
  const phase = preview.querySelector<HTMLElement>('[data-improve-phase]')!;
  const status = preview.querySelector<HTMLElement>('[data-improve-status]')!;
  const retry = preview.querySelector<HTMLButtonElement>('[data-improve-retry]')!;
  const baselineNote = section.querySelector<HTMLElement>('[data-improve-baseline-note]');
  sidebar.append(controls);
  if (baselineNote) noteAnchor.append(baselineNote);
  const facet = controls.querySelector<HTMLFieldSetElement>('fieldset');
  if (facet) {
    preview.querySelector('[data-improve-facet]')!.append(facet);
    facet.querySelector('legend')!.textContent = 'Refine results';
  }
  const jump = document.createElement('button');
  jump.type = 'button';
  jump.className = 'improve-workspace__jump';
  controls.append(jump);
  function updateJump() {
    jump.textContent = !takeaway.hidden ? 'See what changed ↓' :
      'See what visitors find before the change ↓';
  }
  jump.addEventListener('click', () => {
    const destination = !takeaway.hidden ? takeawayToggle : count;
    destination.focus({ preventScroll: true });
    let scrollTarget = destination;
    if (!takeaway.hidden && section.dataset.improveLesson === 'synonyms') {
      setTakeawayOpen(true);
      scrollTarget = count.closest<HTMLElement>('[data-lesson-results]')!;
    }
    scrollTarget.scrollIntoView({ block: 'center' });
  });
  callout.id = resultsId + '-takeaway';
  takeawayToggle.setAttribute('aria-controls', callout.id);
  takeawayToggle.addEventListener('click', () => setTakeawayOpen(callout.hasAttribute('hidden')));
  guidance.id = resultsId + '-own-site';
  const guidanceHeading = document.createElement('h3');
  guidanceHeading.id = guidance.id + '-heading';
  guidanceHeading.textContent = 'Check this on your own site';
  guidanceHeading.tabIndex = -1;
  guidance.setAttribute('role', 'region');
  guidance.setAttribute('aria-labelledby', guidanceHeading.id);
  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'lt-btn lt-btn--secondary';
  back.textContent = 'Back to the lesson';
  back.addEventListener('click', () => {
    setOwnSiteOpen(false);
    ownSiteToggle.focus();
  });
  guidance.prepend(guidanceHeading);
  guidance.append(back);
  ownSiteToggle.setAttribute('aria-controls', guidance.id);
  ownSiteToggle.addEventListener('click', () => {
    const open = guidance.hasAttribute('hidden');
    setOwnSiteOpen(open);
    if (open) {
      guidanceHeading.focus({ preventScroll: true });
      guidanceHeading.scrollIntoView({ block: 'start' });
    }
  });
  followup.append(guidance);
  list.id = resultsId;
  toggle.setAttribute('aria-controls', list.id);
  section.append(preview);

  const connection = () => appliedProfile && phase.hasAttribute('data-applied') ? { ...demo, profile: appliedProfile } : demo;
  const visitor = setupVisitorSearch(preview, connection, query, () => {
    section.dispatchEvent(new Event('lab:rerun-preset'));
  }, (url, title, description) => {
    const item = resultRow(url);
    item.link.textContent = demoResultTitle(title);
    item.description.textContent = demoResultText(description).replace(/<\/?(?:em|b|strong)>/gi, '');
    item.description.hidden = !item.description.textContent;
    return item.row;
  });
  toggle.addEventListener('click', () => {
    visitor.reset();
    setLessonApplied(toggle, !toggle.hasAttribute('data-applied'));
  });
  section.addEventListener(lessonStartEvent, visitor.reset);
  section.addEventListener('lab:leave-lesson', visitor.reset);

  function setOwnSiteOpen(open: boolean) {
    guidance.hidden = !open;
    (open ? guidance : next).append(chooseScenario);
    ownSiteToggle.setAttribute('aria-expanded', String(open));
  }

  function setTakeawayOpen(open: boolean) {
    callout.hidden = !open;
    takeawayToggle.setAttribute('aria-expanded', String(open));
  }

  function setTakeaway(content?: HTMLElement, anchor: HTMLElement = noteAnchor) {
    const wasHidden = takeaway.hidden;
    takeaway.hidden = !content;
    if (content) {
      anchor.append(takeaway);
      callout.replaceChildren(content);
      if (wasHidden) setTakeawayOpen(true);
    } else {
      noteAnchor.append(takeaway);
      callout.replaceChildren();
      if (!toggle.hasAttribute('data-applied')) setOwnSiteOpen(false);
    }
    updateJump();
  }

  function resetWrapUp() {
    setTakeaway();
    setOwnSiteOpen(false);
    for (const details of guidance.querySelectorAll<HTMLDetailsElement>('details[open]')) details.open = false;
  }

  updateJump();
  return {
    preview, list, count, phase, status, retry, toggle, next, baselineNote,
    setOwnSiteOpen, setTakeaway, resetWrapUp,
  };
}

function setupLiveLesson(section: HTMLElement, template: HTMLTemplateElement, lesson: Lesson, demo: CustomerConnection, afterProfile: string) {
  const rankingWatch = section.querySelector<HTMLElement>('[data-ranking-watch]');
  const search = { query: queries[lesson], start: 0, rows: resultLimit, sort: '', filters: new Map<string, string>() };
  const {
    preview, list, count, phase, status, retry, toggle, next,
    baselineNote, setOwnSiteOpen, setTakeaway, resetWrapUp,
  } = mountPreview(section, template, search.query, 'lab-' + lesson + '-results', demo, afterProfile);
  const lessonResults = preview.querySelector<HTMLElement>('[data-lesson-results]')!;
  const visitorQuery = preview.querySelector<HTMLInputElement>('[data-improve-query]')!;
  toggle.after(status, retry);
  status.id = lesson === 'missing-page' ? 'lab-search-fields-status' : 'lab-ranking-status';
  retry.setAttribute('aria-describedby', status.id);
  const promotion = section.querySelector<HTMLDetailsElement>('[data-clinic-promotion]');
  const promotionSummary = promotion?.querySelector('summary');
  if (promotion) preview.querySelector('[data-improve-preview-followup]')!.append(promotion);

  const endpoint = readCustomerEndpoint(demo.endpoint);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const rows = new Map<string, ReturnType<typeof resultRow>>();
  const animations = new Set<Animation>();
  let baseline: CustomerPage | undefined;
  let shown: boolean | undefined;
  let retryApplied: boolean | undefined;
  let pending: AbortController | undefined;
  let resultNumber = 0;

  function notify(message: string, kind: 'visible' | 'spoken' | 'error' = 'visible') {
    status.classList.toggle('search-lab__sr-only', kind === 'spoken');
    status.dataset.tone = kind === 'error' ? 'error' : '';
    status.textContent = message;
  }

  function stopAnimations() {
    for (const animation of animations) animation.cancel();
    animations.clear();
  }

  function animate(element: HTMLElement, frames: Keyframe[], options: KeyframeAnimationOptions) {
    const animation = element.animate(frames, options);
    animations.add(animation);
    animation.onfinish = () => { animations.delete(animation); };
  }

  function render(page: CustomerPage, applied: boolean, withMotion: boolean) {
    const results = previewResults(page);
    preview.querySelector<HTMLElement>('[data-improve-empty-hint]')!.hidden = page.total !== 0;
    const before = applied && baseline ? previewResults(baseline) : undefined;
    const outcome = before && baseline ? explainChange(lesson, baseline, before, results) : undefined;
    if (rankingWatch) {
      const original = before ?? results;
      const clinic = original.findIndex(result => new URL(result.url).pathname === northCampusPath);
      const notice = original.findIndex(result => new URL(result.url).pathname === currentNoticePath);
      rankingWatch.textContent = clinic >= 0 && notice >= 0
        ? `Watch North Campus Clinic at #${clinic + 1} and this year’s notice at #${notice + 1} in the original order.`
        : 'Look at the order of the first few results before changing the setting.';
    }
    const moving = withMotion && !motion.matches && rows.size > 0;
    const positions = new Map<string, number>();
    if (moving) {
      const listTop = list.getBoundingClientRect().top;
      for (const [url, { row }] of rows) positions.set(url, row.getBoundingClientRect().top - listTop);
    }
    stopAnimations();

    const focused = document.activeElement;
    const focusedResult = focused instanceof HTMLElement && list.contains(focused) ? focused : undefined;
    const urls = new Set(results.map(result => result.url));
    for (const [url, { row }] of rows) {
      if (urls.has(url)) continue;
      row.remove();
      rows.delete(url);
    }
    results.forEach((result, index) => {
      const item = rows.get(result.url) ?? resultRow(result.url, lesson === 'flu-clinic-order');
      rows.set(result.url, item);
      if (!item.link.id) item.link.id = list.id + '-result-' + ++resultNumber;
      item.link.textContent = demoResultTitle(result.title);
      item.description.textContent = demoResultText(result.description).replace(/<\/?(?:em|b|strong)>/gi, '');
      item.description.hidden = !item.description.textContent;
      if (item.rank) item.rank.textContent = '#' + (index + 1);
      highlightResult(item, outcome?.highlights.get(result.url));
      const sibling = list.children[index];
      if (sibling !== item.row) list.insertBefore(item.row, sibling ?? null);
    });

    if (outcome) {
      const changed = Array.from(outcome.highlights.keys(), url => rows.get(url)!);
      const callout = createCallout(outcome.heading, outcome.explanation ?? outcome.detail, changed);
      if (promotion && promotionSummary) {
        const link = document.createElement('a');
        link.className = 'improve-preview__promotion-link';
        link.href = '#' + promotionSummary.id;
        link.textContent = 'Feature one page first with a Promotion';
        link.addEventListener('click', event => {
          event.preventDefault();
          promotion.open = true;
          promotionSummary.focus({ preventScroll: true });
          promotionSummary.scrollIntoView({ block: 'center' });
        });
        callout.append(link);
      }
      setTakeaway(callout, changed[0]?.row);
    } else {
      setTakeaway();
    }
    if (baselineNote) {
      baselineNote.hidden = applied || !results.length || page.total > results.length
        || results.some(result => new URL(result.url).pathname === internationalHealthPath);
    }

    count.textContent = page.total > results.length
      ? 'Top ' + results.length + ' of ' + page.total + ' results'
      : results.length + (results.length === 1 ? ' result' : ' results');
    phase.hidden = false;
    setResultPhase(phase, applied ? 'Change applied' : 'Before change');
    shown = applied;
    next.hidden = !applied;
    if (!applied) setOwnSiteOpen(false);
    if (promotion && !applied && window.location.hash !== '#lab-clinic-promotion') promotion.open = false;
    if (promotion) promotion.hidden = !applied && window.location.hash !== '#lab-clinic-promotion';
    if (outcome) {
      notify(outcome.heading + '. ' + outcome.detail + ' Search Lab note available.', 'spoken');
    } else if (before) {
      notify(describeObservedChange(before, results));
    } else if (results.length === 0) {
      notify('No results for this search.');
    } else {
      notify('Before the change. ' + count.textContent + '.', 'spoken');
    }

    if (moving) {
      const listTop = list.getBoundingClientRect().top;
      for (const [url, { row }] of rows) {
        const first = positions.get(url);
        if (first === undefined) {
          animate(row, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 230, easing: 'ease-out' });
          continue;
        }
        const shift = first - (row.getBoundingClientRect().top - listTop);
        if (Math.abs(shift) > 1) {
          animate(row, [{ transform: 'translateY(' + shift + 'px)' }, { transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.2,.75,.25,1)' });
        }
      }
    }
    if (focusedResult && document.activeElement !== focusedResult) {
      const destination = list.contains(focusedResult) ? focusedResult : toggle;
      destination.focus({ preventScroll: true });
    }
  }

  async function run(withMotion: boolean, applied = toggle.hasAttribute('data-applied'), fromSearch = false) {
    if (fromSearch) {
      if (lessonResults.firstElementChild !== status) lessonResults.prepend(status, retry);
    } else if (toggle.nextElementSibling !== status) toggle.after(status, retry);
    pending?.abort();
    const controller = new AbortController();
    pending = controller;
    retryApplied = undefined;
    const retryHadFocus = document.activeElement === retry;
    if (!retryHadFocus) retry.hidden = true;
    retry.setAttribute('aria-disabled', 'true');
    list.setAttribute('aria-busy', 'true');
    if (shown !== undefined) setResultPhase(phase, 'Updating…');
    notify(shown === undefined ? 'Searching Central County…' : 'Rerunning the same search…',
      shown === undefined ? 'visible' : 'spoken');

    try {
      if (!endpoint || !demo.profile || !demo.token || !afterProfile || afterProfile === demo.profile) throw new Error('Demo profiles unavailable');
      const connection = { ...demo, endpoint };
      const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(12000)]);
      if (applied && !baseline) {
        const beforePage = await searchCustomerApp(connection, search, signal);
        if (pending !== controller) return;
        baseline = beforePage;
      }
      const page = await searchCustomerApp({ ...connection, profile: applied ? afterProfile : demo.profile }, search, signal);
      if (pending !== controller) return;
      if (!applied) baseline = page;
      toggle.disabled = false;
      setLessonApplied(toggle, applied);
      if (document.activeElement === retry) (fromSearch ? visitorQuery : toggle).focus({ preventScroll: true });
      retry.hidden = true;
      render(page, applied, withMotion);
    } catch {
      if (pending !== controller) return;
      retryApplied = applied;
      setLessonApplied(toggle, shown ?? false);
      if (shown !== undefined) setResultPhase(phase, shown ? 'Change applied' : 'Before change');
      notify(shown === undefined
        ? 'The Central County results couldn’t load.'
        : 'The search couldn’t update. The previous results are still visible.', 'error');
      retry.hidden = false;
      if (fromSearch && document.activeElement === visitorQuery && visitorQuery.getBoundingClientRect().bottom > 0 &&
          visitorQuery.getBoundingClientRect().top < innerHeight && retry.getBoundingClientRect().bottom > innerHeight) {
        retry.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    } finally {
      if (pending === controller) {
        pending = undefined;
        retry.removeAttribute('aria-disabled');
        list.removeAttribute('aria-busy');
      }
    }
  }

  function stop() {
    pending?.abort();
    pending = undefined;
    retry.removeAttribute('aria-disabled');
    list.removeAttribute('aria-busy');
    stopAnimations();
  }

  function reset() {
    stop();
    baseline = undefined;
    if (rankingWatch) rankingWatch.textContent = '';
    shown = retryApplied = undefined;
    setLessonApplied(toggle, false);
    toggle.disabled = true;
    retry.hidden = phase.hidden = next.hidden = true;
    preview.querySelector<HTMLElement>('[data-improve-empty-hint]')!.hidden = true;
    resetWrapUp();
    list.replaceChildren();
    if (baselineNote) baselineNote.hidden = true;
    rows.clear();
    resultNumber = 0;
    count.textContent = 'Search results';
    notify('');
    if (promotion) {
      promotion.hidden = true;
      promotion.open = false;
    }
  }

  section.addEventListener('lab:rerun-preset', () => { void run(false, undefined, true); });
  toggle.addEventListener('click', () => { void run(true); });
  retry.addEventListener('click', () => { if (!pending) void run(true, retryApplied, status.parentElement === lessonResults); });
  motion.addEventListener('change', stopAnimations);
  section.addEventListener(lessonStartEvent, reset);

  function activate(hash: string) {
    if (promotion && hash === '#' + promotionSummary?.id) promotion.hidden = false;
    const deepLink = hash === '#lab-missing-page-steps' || hash === '#lab-missing-page-takeaway';
    const changedByLink = deepLink && !toggle.hasAttribute('data-applied');
    if (deepLink) {
      setLessonApplied(toggle, true);
      if (hash === '#lab-missing-page-steps') {
        next.hidden = false;
        setOwnSiteOpen(true);
      }
    }
    if (changedByLink || (!pending && (shown !== toggle.hasAttribute('data-applied') || !retry.hidden))) void run(false);
  }

  return { activate, stop };
}

function mountRecordedPreview(section: HTMLElement, template: HTMLTemplateElement, query: string, resultsId: string, source: string, demo: CustomerConnection) {
  const mounted = mountPreview(section, template, query, resultsId, demo);
  const { preview, phase, status } = mounted;
  preview.setAttribute('aria-label', 'Recorded search preview');
  preview.querySelector('.search-lab__preview-footnote')!.textContent = source;
  preview.querySelector('[data-preview-label]')!.textContent = 'Recorded visitor preview';
  status.classList.add('search-lab__sr-only');
  phase.hidden = false;
  return mounted;
}

function addRecordedResult(list: HTMLElement, path: string, title: string, description: string) {
  const item = resultRow(demoSite + path);
  item.link.textContent = title;
  item.description.textContent = description;
  list.append(item.row);
  return item;
}

function setupRecordedSynonym(section: HTMLElement, template: HTMLTemplateElement, demo: CustomerConnection) {
  const { preview, list, count, phase, status, toggle, next, setTakeaway, resetWrapUp } =
    mountRecordedPreview(section, template, 'ENT', 'lab-synonym-results', 'Recorded example from the fictional Central County website.', demo);
  const department = addRecordedResult(list, 'care/services/otolaryngology/', 'Otolaryngology', 'Explore the ear, nose and throat subject areas of Central County’s fictional Otolaryngology department.');
  department.link.id = list.id + '-department';
  highlightResult(department, newMatch);
  const detail = 'The visitor still searched for “ENT.” The one-way synonym let search use “Otolaryngology” and find the department page.';
  const callout = createCallout('Why the department appeared', detail, [department]);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let entrance: Animation | undefined;

  function render(animate: boolean) {
    const changed = toggle.hasAttribute('data-applied');
    entrance?.cancel();
    next.hidden = !changed;
    preview.querySelector<HTMLElement>('[data-improve-empty-hint]')!.hidden = changed;
    department.row.hidden = !changed;
    list.hidden = !changed;
    setTakeaway(changed ? callout : undefined, department.row);
    count.textContent = changed ? '1 result' : '0 results';
    setResultPhase(phase, changed ? 'Change applied' : 'Before change');
    status.classList.toggle('search-lab__sr-only', changed);
    status.textContent = changed ? 'One new match. ' + detail + ' Search Lab note available.' : 'No results for “ENT.”';
    if (changed && animate && !motion.matches) {
      entrance = department.row.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 230, easing: 'ease-out' });
    }
  }

  section.addEventListener(lessonStartEvent, () => {
    setLessonApplied(toggle, false);
    resetWrapUp();
    render(false);
  });
  section.addEventListener('lab:rerun-preset', () => render(false));
  toggle.addEventListener('click', () => render(true));
  motion.addEventListener('change', () => entrance?.cancel());
  render(false);
}

function setupRecordedProviders(section: HTMLElement, template: HTMLTemplateElement, demo: CustomerConnection) {
  const { preview, list, count, phase, status, toggle, next, setTakeaway, resetWrapUp } =
    mountRecordedPreview(section, template, 'campus flu clinic', 'lab-provider-results', 'Selected results recorded from Search Lab’s demo profile.', demo);
  const context = preview.querySelector<HTMLElement>('[data-improve-context]')!;
  list.setAttribute('aria-label', 'Selected search results');
  const provider = preview.querySelector<HTMLInputElement>('[data-improve-provider]')!;
  provider.addEventListener('change', () => {
    setLessonApplied(toggle, provider.checked);
    render(true);
  });
  const excluded = [
    addRecordedResult(list, 'news/flu-clinic-update-2024/', 'Flu Clinic Updates — 2024 Archive', 'A fictional 2024 archive notice records a sample flu clinic updates pack of poster headings and document labels.').row,
    addRecordedResult(list, 'locations/north-campus-clinic/', 'North Campus Clinic', 'A fictional northern teaching annex stores Primary Care and Neurology classroom materials.').row,
  ];
  const tessa = addRecordedResult(list, 'care/providers/tessa-rowan/', 'Tessa Rowan', 'Pediatrics teaching materials include age-labelled models and a campus-themed picture-book shelf.');
  const mara = addRecordedResult(list, 'care/providers/mara-ellison/', 'Mara Ellison', 'A faculty member who develops equipment demonstrations and illustrated case materials at the university’s campus center.');
  const detail = 'Tessa Rowan and Mara Ellison already matched. The filter hid the notice and location. In Site Search, this kind of filter is called a facet.';
  const callout = createCallout('Same search, fewer results', detail);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const exits = new Set<Animation>();

  function cancelExits() {
    for (const exit of exits) exit.cancel();
    exits.clear();
  }

  function render(animate: boolean) {
    const filtered = toggle.hasAttribute('data-applied');
    provider.checked = filtered;
    next.hidden = !filtered;
    cancelExits();
    for (const row of excluded) {
      row.inert = filtered;
      if (!filtered || !animate || motion.matches || row.hidden) {
        row.hidden = filtered;
        continue;
      }
      const exit = row.animate([
        { opacity: 1, height: row.offsetHeight + 'px' },
        { opacity: 0, height: '0px' },
      ], { duration: 240, easing: 'ease-in-out', fill: 'forwards' });
      exits.add(exit);
      exit.onfinish = () => {
        row.hidden = true;
        exits.delete(exit);
        exit.cancel();
      };
    }
    for (const provider of [tessa, mara]) highlightResult(provider, filtered ? keptByFilter : undefined);
    setTakeaway(filtered ? callout : undefined);
    context.textContent = filtered ? 'Content type: Providers' : 'Across all content';
    count.textContent = filtered ? '8 provider matches · 2 shown' : '44 matches · 4 shown';
    setResultPhase(phase, filtered ? 'Change applied' : 'Before change');
    status.textContent = filtered ? count.textContent + '. ' + detail + ' Search Lab note available.' : count.textContent + '.';
  }

  section.addEventListener(lessonStartEvent, () => {
    setLessonApplied(toggle, false);
    resetWrapUp();
    render(false);
  });
  section.addEventListener('lab:rerun-preset', () => render(false));
  toggle.addEventListener('click', () => render(true));
  motion.addEventListener('change', () => {
    if (!motion.matches || !exits.size) return;
    cancelExits();
    for (const row of excluded) row.hidden = true;
  });
  render(false);
}

export function setupImprovePreview(root: HTMLElement, demo: CustomerConnection, fieldsAfter: string, rankingAfter: string) {
  const template = root.querySelector<HTMLTemplateElement>('#lab-improve-preview-template')!;
  const chooser = root.querySelector<HTMLFieldSetElement>('#lab-improve-scenario')!;
  const choices = chooser.querySelectorAll<HTMLInputElement>('input[type="radio"]');
  const panels = root.querySelectorAll<HTMLElement>('[data-improve-lesson]');
  const controls = root.querySelectorAll<HTMLElement>('[data-improve-controls]');
  const panel = (id: ImproveScenario) => root.querySelector<HTMLElement>(`[data-improve-lesson="${id}"]`)!;
  const travel = setupLiveLesson(panel('missing-page'), template, 'missing-page', demo, fieldsAfter);
  const ranking = setupLiveLesson(panel('flu-clinic-order'), template, 'flu-clinic-order', demo, rankingAfter);
  const live = { 'missing-page': travel, 'flu-clinic-order': ranking, synonyms: undefined, facets: undefined };
  setupRecordedSynonym(panel('synonyms'), template, demo);
  setupRecordedProviders(panel('facets'), template, demo);
  let selected: ImproveScenario | undefined;

  function selectScenario(scenario: ImproveScenario | undefined, hash: string = '') {
    if (selected !== scenario) {
      if (selected) {
        live[selected]?.stop();
        panel(selected).dispatchEvent(new Event('lab:leave-lesson'));
      }
      selected = scenario;
      for (const choice of choices) choice.checked = choice.value === scenario;
      for (const lesson of panels) lesson.hidden = lesson.dataset.improveLesson !== scenario;
      for (const action of controls) action.hidden = action.dataset.improveControls !== scenario;
      if (scenario) panel(scenario).dispatchEvent(new Event(lessonStartEvent));
    }
    if (scenario) live[scenario]?.activate(hash);
  }

  chooser.addEventListener('change', event => {
    if (!(event.target instanceof HTMLInputElement)) return;
    const scenario = event.target.value as ImproveScenario;
    if (!Object.hasOwn(live, scenario) || scenario === selected) return;
    if (window.location.hash !== '#lab-improve') window.history.replaceState(window.history.state, '', '#lab-improve');
    selectScenario(scenario);
  });

  return (view: string, hash: string) => {
    selectScenario(view === 'improve' ? improveScenarioForHash(hash) : undefined, hash);
  };
}
