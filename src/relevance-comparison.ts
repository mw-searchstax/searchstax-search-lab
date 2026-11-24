import { createSearchRecovery } from './search-recovery';
import { demoResultTitle } from './demo-content.js';
import { readCustomerEndpoint, searchCustomerApp, type CustomerConnection, type CustomerPage } from './customer-search';

type Scenario = 'fields' | 'ranking';
type Result = CustomerPage['results'][number];
const limit = 5;

export function resultTitle(result: Result) {
  return demoResultTitle(result.title);
}

function describe(scenario: Scenario, before: Result[], after: Result[]) {
  if (!before.length && !after.length) return 'Neither profile returned results.';
  if (scenario === 'fields') {
    const targetIndex = (results: Result[]) => results.findIndex(result => resultTitle(result) === 'International Health');
    const afterIndex = targetIndex(after);
    if (afterIndex >= 0 && targetIndex(before) < 0) {
      return `International Health appears in After at #${afterIndex + 1}.`;
    }
  }
  if (before.length === after.length && before.every((result, index) => result.url === after[index].url)) {
    return 'The displayed results stayed in the same order.';
  }
  if (!before.length) return 'After returned results for this query.';
  if (!after.length) return 'After returned no results for this query.';
  if (before[0].url === after[0].url) return `“${resultTitle(after[0])}” stayed first. Other displayed results changed.`;
  const priorRank = before.findIndex(result => result.url === after[0].url);
  return priorRank < 0
    ? `“${resultTitle(after[0])}” is now first.`
    : `“${resultTitle(after[0])}” moved from #${priorRank + 1} to #1.`;
}

export function setupRelevanceComparison(root: HTMLElement, demo: CustomerConnection) {
  const status = root.querySelector<HTMLElement>('[data-lab-comparison-outcome]')!;
  const controls = root.querySelector<HTMLElement>('[data-lab-comparison]')!;
  const defaultControl = controls.querySelector<HTMLButtonElement>('button')!;
  let retryComparison: (() => void) | undefined;
  const recovery = createSearchRecovery(defaultControl, () => retryComparison?.());
  const table = root.querySelector<HTMLTableElement>('[data-lab-comparison-table]')!;
  const endpoint = readCustomerEndpoint(demo.endpoint);
  let current: { query: string; scenario: Scenario; afterProfile: string; controller: AbortController } | undefined;

  function clear() {
    current?.controller.abort();
    current = undefined;
    status.textContent = '';
    table.hidden = true;
    retryComparison = undefined;
    recovery.clear();
  }

  async function compare(query: string, scenario: Scenario, afterProfile: string) {
    if (current?.query === query && current.scenario === scenario && current.afterProfile === afterProfile) return;
    clear();
    recovery.begin(controls, controls.querySelector<HTMLElement>('[aria-pressed="true"]') || defaultControl);
    const controller = new AbortController();
    current = { query, scenario, afterProfile, controller };
    status.textContent = 'Loading both sets of results…';
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(12000)]);
    const search = { query, start: 0, rows: limit, sort: '', filters: new Map<string, string>() };

    try {
      if (!endpoint || !demo.token || !demo.profile || !afterProfile || afterProfile === demo.profile) {
        throw new Error('The comparison profiles are unavailable.');
      }
      const connection = { ...demo, endpoint };
      const [beforePage, afterPage] = await Promise.all([
        searchCustomerApp(connection, search, signal),
        searchCustomerApp({ ...connection, profile: afterProfile }, search, signal),
      ]);
      if (current?.controller !== controller) return;
      const before = beforePage.results.slice(0, limit);
      const after = afterPage.results.slice(0, limit);
      const rows = Array.from({ length: Math.max(before.length, after.length) }, (_, index) => {
        const row = document.createElement('tr');
        const rank = document.createElement('th');
        rank.scope = 'row';
        rank.textContent = String(index + 1);
        row.append(rank);
        for (const result of [before[index], after[index]]) {
          row.insertCell().textContent = result ? resultTitle(result) : '—';
        }
        return row;
      });
      table.caption!.textContent = `Unfiltered results for “${query}”`;
      table.tBodies[0].replaceChildren(...rows);
      table.hidden = !rows.length;
      status.textContent = describe(scenario, before, after);
    } catch {
      if (current?.controller !== controller) return;
      current = undefined;
      status.textContent = '';
      retryComparison = () => { void compare(query, scenario, afterProfile); };
      recovery.error('The comparison couldn’t load.', 'Retry comparison');
    } finally {
      controller.abort();
    }
  }

  return { compare, clear };
}
