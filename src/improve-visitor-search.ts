import {
  searchCustomerApp,
  type CustomerConnection,
  type CustomerSearch,
} from './customer-search';

const pageSize = 5;

/**
 * Mounts the visitor-facing search used by an Improve lesson preview.
 *
 * The lesson's preset remains the primary example. A visitor search is a
 * separate, paginated request so trying another query can't overwrite the
 * lesson's baseline or applied-profile state.
 */
export function setupVisitorSearch(
  preview: HTMLElement,
  connection: () => CustomerConnection,
  preset: string,
  onPreset: () => void,
  renderResult: (url: string, title: string, description: string) => HTMLElement,
) {
  const form = preview.querySelector<HTMLFormElement>('[data-visitor-form]')!;
  const query = form.querySelector<HTMLInputElement>('[data-improve-query]')!;
  const returnButton = preview.querySelector<HTMLButtonElement>('[data-visitor-return]')!;
  const lessonLabel = preview.querySelector<HTMLElement>('[data-preview-label]')!;
  const browsingLabel = preview.querySelector<HTMLElement>('[data-browsing-label]')!;
  const output = preview.querySelector<HTMLElement>('[data-visitor-output]')!;
  const status = output.querySelector<HTMLElement>('[data-visitor-status]')!;
  const results = output.querySelector<HTMLOListElement>('[data-visitor-results]')!;
  const previous = output.querySelector<HTMLButtonElement>('[data-visitor-prev]')!;
  const next = output.querySelector<HTMLButtonElement>('[data-visitor-next]')!;
  const retry = output.querySelector<HTMLButtonElement>('[data-visitor-retry]')!;

  let search: CustomerSearch = {
    query: preset,
    start: 0,
    rows: pageSize,
    sort: '',
    filters: new Map(),
  };
  let pending: AbortController | undefined;
  let failedSearch: CustomerSearch | undefined;
  const pages = next.parentElement!;
  let displayedStart = 0;
  let paging = false;
  status.id = 'visitor-status-' + query.closest('[data-improve-lesson]')!.getAttribute('data-improve-lesson');
  retry.setAttribute('aria-describedby', status.id);

  function setBrowsing(browsing: boolean) {
    preview.toggleAttribute('data-browsing', browsing);
    output.hidden = !browsing;
    returnButton.hidden = !browsing;
    lessonLabel.hidden = browsing;
    browsingLabel.hidden = !browsing;
  }

  function setStatus(message: string, tone: 'error' | '' = '') {
    status.textContent = message;
    status.dataset.tone = tone;
  }

  function renderPage(page: Awaited<ReturnType<typeof searchCustomerApp>>) {
    results.replaceChildren(...page.results.map(result =>
      renderResult(result.url, result.title, result.description),
    ));
    displayedStart = search.start;
    output.hidden = false;
    setStatus(page.total === 0
      ? `No results for “${search.query}”.`
      : `${search.start + 1}–${Math.min(search.start + page.resultCount, page.total)} of ${page.total} results for “${search.query}”.`);
    const focused = document.activeElement;
    previous.hidden = search.start === 0;
    next.hidden = search.start + search.rows >= page.total;
    previous.disabled = search.start === 0;
    next.disabled = search.start + search.rows >= page.total;
    if (focused === retry || (focused instanceof HTMLElement && pages.contains(focused) && focused.hidden)) {
      status.focus({ preventScroll: true });
    }
    retry.hidden = true;
    failedSearch = undefined;
  }

  async function run(candidate: CustomerSearch, changePage = false) {
    pending?.abort();
    const controller = new AbortController();
    pending = controller;
    search = candidate;
    failedSearch = undefined;
    paging = changePage;
    setBrowsing(true);
    if (paging) {
      if (pages.nextElementSibling !== status) pages.after(status, retry);
    } else {
      if (output.firstElementChild !== status) output.prepend(status, retry);
      results.replaceChildren();
      previous.hidden = next.hidden = true;
    }
    results.setAttribute('aria-busy', 'true');
    setStatus('Searching Central County…');
    if (document.activeElement !== retry) retry.hidden = true;
    retry.setAttribute('aria-disabled', 'true');
    const timer = window.setTimeout(() => controller.abort(), 12000);

    try {
      const page = await searchCustomerApp(connection(), candidate, controller.signal);
      if (pending !== controller) return;
      renderPage(page);
    } catch {
      if (pending !== controller) return;
      failedSearch = candidate;
      setStatus('The search couldn’t load. Try again.', 'error');
      retry.hidden = false;
      output.hidden = false;
      const origin = paging ? pages : form;
      const bounds = origin.getBoundingClientRect();
      if ((origin.contains(document.activeElement) || document.activeElement === retry) &&
          bounds.bottom >= 0 && bounds.top < innerHeight && retry.getBoundingClientRect().bottom > innerHeight - 8) {
        retry.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    } finally {
      window.clearTimeout(timer);
      if (pending === controller) {
        pending = undefined;
        results.removeAttribute('aria-busy');
        retry.removeAttribute('aria-disabled');
      }
    }
  }

  function submit() {
    const value = query.value.trim().replace(/\s+/g, ' ');
    if (!value || value.toLowerCase() === preset.toLowerCase()) {
      reset();
      onPreset();
      query.focus({ preventScroll: true });
      return;
    }
    void run({ ...search, query: value, start: 0 });
  }

  function reset() {
    pending?.abort();
    pending = undefined;
    failedSearch = undefined;
    search = { query: preset, start: 0, rows: pageSize, sort: '', filters: new Map() };
    query.value = preset;
    results.removeAttribute('aria-busy');
    retry.removeAttribute('aria-disabled');
    results.replaceChildren();
    setStatus('');
    retry.hidden = true;
    previous.hidden = true;
    next.hidden = true;
    previous.disabled = true;
    next.disabled = true;
    setBrowsing(false);
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    submit();
  });
  returnButton.addEventListener('click', () => {
    reset();
    onPreset();
    query.focus({ preventScroll: true });
  });
  previous.addEventListener('click', () => {
    if (!pending && displayedStart >= pageSize) void run({ ...search, start: displayedStart - pageSize }, true);
  });
  next.addEventListener('click', () => {
    if (!pending) void run({ ...search, start: displayedStart + pageSize }, true);
  });
  retry.addEventListener('click', () => {
    if (!pending && failedSearch) void run(failedSearch, paging);
  });

  reset();
  return { reset };
}
