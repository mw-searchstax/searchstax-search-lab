import { demoResultTitle } from './demo-content.js';
import { readCustomerEndpoint, searchCustomerApp, type CustomerConnection, type CustomerPage, type CustomerSearch } from './customer-search';

const contentType = 'demo_content_type_s';
const search: CustomerSearch = { query: 'campus flu clinic', start: 0, rows: 5, sort: '', filters: new Map() };
type FilterChoice = { label: string; effect?: string; search?: CustomerSearch };

const rules: Record<string, FilterChoice> = {
  include: {
    label: 'Include Locations',
    effect: 'Only matching location pages are eligible.',
    search: { ...search, filters: new Map([[contentType, 'location']]) },
  },
  exclude: {
    label: 'Exclude News',
    effect: 'Matching news pages are omitted. Other content types can still appear.',
    search: { ...search, excludeFilters: new Map([[contentType, 'news']]) },
  },
};

function renderPage(count: HTMLElement, list: HTMLOListElement, page: CustomerPage) {
  count.textContent = page.total
    ? `Showing ${page.results.length} of ${page.total} ${page.total === 1 ? 'result' : 'results'}`
    : 'No results';
  list.replaceChildren(...page.results.map(result => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = result.url;
    link.textContent = demoResultTitle(result.title);
    item.append(link);
    return item;
  }));
}

export function setupDataFilters(root: HTMLElement, demo: CustomerConnection) {
  const section = root.querySelector<HTMLElement>('[data-lab-screen="data-filters"]')!;
  section.querySelector('[data-lab-filter-profile]')!.textContent = demo.profile;
  return setupComparison(section, demo, 'lab-data-filter-rule', rules, {
    describe: (before, after, choice) => `${before.total} results before the rule. ${after.total} with ${choice.label}.`,
    renderBaseline(before) {
      renderPage(section.querySelector('[data-lab-filter-before-count]')!, section.querySelector('[data-lab-filter-before-list]')!, before);
    },
  });
}

function setupComparison(
  section: HTMLElement,
  demo: CustomerConnection,
  group: string,
  choices: Record<string, FilterChoice>,
  display: {
    describe: (before: CustomerPage, after: CustomerPage, choice: FilterChoice) => string;
    renderBaseline?: (before: CustomerPage) => void;
  },
) {
  const status = section.querySelector<HTMLElement>('[data-lab-filter-status]')!;
  const afterCount = section.querySelector<HTMLElement>('[data-lab-filter-after-count]')!;
  const afterList = section.querySelector<HTMLOListElement>('[data-lab-filter-after-list]')!;
  const effect = section.querySelector<HTMLElement>('[data-lab-filter-effect]');
  const results = section.querySelector<HTMLElement>('[data-lab-filter-results]')!;
  const retry = section.querySelector<HTMLButtonElement>('[data-lab-filter-retry]')!;
  const optionSelector = `input[name="${group}"]`;
  const endpoint = readCustomerEndpoint(demo.endpoint);
  let pending: AbortController | undefined;

  function cancel() {
    pending?.abort();
    pending = undefined;
  }

  async function compare() {
    cancel();
    const focusAtStart = document.activeElement;
    const selected = section.querySelector<HTMLInputElement>(optionSelector + ':checked');
    const choice = choices[selected?.value ?? 'all'];
    results.hidden = true;
    const controller = new AbortController();
    pending = controller;
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(12000)]);
    status.textContent = 'Searching the fictional demo…';

    try {
      if (!endpoint || !demo.token || !demo.profile) throw new Error('Demo search is unavailable');
      const connection = { ...demo, endpoint };
      const [before, filtered] = await Promise.all([
        searchCustomerApp(connection, search, signal),
        choice.search && searchCustomerApp(connection, choice.search, signal),
      ]);
      if (pending !== controller) return;
      const after = filtered ?? before;
      display.renderBaseline?.(before);
      renderPage(afterCount, afterList, after);
      if (effect) effect.textContent = choice.effect ?? '';
      results.hidden = false;
      status.textContent = display.describe(before, after, choice);
      if (document.activeElement === retry) {
        const control = selected ?? section.querySelector<HTMLInputElement>(optionSelector)!;
        control.focus();
      }
      retry.hidden = true;
    } catch {
      if (pending !== controller) return;
      status.textContent = 'The comparison couldn’t load. Try the search again.';
      retry.hidden = false;
      requestAnimationFrame(() => {
        if (pending || retry.hidden || !selected?.getClientRects().length) return;
        const control = selected.getBoundingClientRect();
        const atRule = document.activeElement === focusAtStart || document.activeElement === selected;
        if (atRule && control.bottom > 0 && control.top < innerHeight && retry.getBoundingClientRect().bottom > innerHeight - 8) {
          retry.scrollIntoView({ block: 'center', behavior: 'instant' });
        }
      });
    } finally {
      controller.abort();
      if (pending === controller) pending = undefined;
    }
  }

  for (const input of section.querySelectorAll<HTMLInputElement>(optionSelector)) {
    input.addEventListener('change', compare);
  }
  retry.addEventListener('click', compare);
  return (visible: boolean) => {
    if (visible) void compare();
    else cancel();
  };
}
