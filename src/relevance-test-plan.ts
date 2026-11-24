import { setupRequestCopy } from './copy-checklist-request';

const checklists = {
  fields: {
    name: 'Search Fields',
    queries: 'Visitor’s query',
    queryPrompt: '[query that should find the target page]',
    expectedPrompt: '[indexed field to include and target page the visitor’s query should find]',
    steps: [
      'In Preview, select the test App, language, and profile. Run all three queries and record the first results and whether each search finds the target URL.',
      'Confirm the page is indexed and eligible for the test profile. In Configurations → Basic Configurations → Search Fields, select the indexed text field that contains the visitor’s words.',
      'Save a draft and publish to the confirmed test profile only. Repeat the three searches in Preview. Confirm the visitor’s query finds the target URL, the title query still finds the page, and the control query keeps its top results.',
    ],
  },
  ranking: {
    name: 'Ranking',
    queries: 'Two queries to improve',
    queryPrompt: '[two queries where the target pages should rank higher]',
    expectedPrompt: '[searchable field and boost to try, and which pages should move up]',
    steps: [
      'In Preview, select the test App, language, and profile. Run the two queries to improve and the control query. Record the top five in relevance order and the current position of each target page.',
      'In Configurations → Advanced Configurations → Ranking, enable Field Ranking if needed. Under Search Field, choose a searchable field and try a small boost.',
      'Save a draft and publish to the confirmed test profile only. Repeat the three searches in Preview. Verify the target pages moved up and the control query kept the same top five in the same order.',
    ],
  },
};

function setupTestPlan(section: HTMLElement, kind: keyof typeof checklists) {
  const plan = checklists[kind];
  const inputs = Array.from(section.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[name], textarea[name]'));
  const copyButton = section.querySelector<HTMLButtonElement>('[data-test-plan-copy]')!;
  const copyStatus = section.querySelector<HTMLElement>('[data-test-plan-status]')!;
  const request = section.querySelector<HTMLTextAreaElement>('[data-test-plan-request]')!;

  function update() {
    const values = new Map(inputs.map(input => [input.name, input.value.trim()]));
    const text = (name: string, fallback: string) => values.get(name) || fallback;
    const queryLines = [`${plan.queries} — ${text('query', plan.queryPrompt)}`];
    if (kind === 'fields') queryLines.push(`Query using the page title — ${text('title-query', '[distinctive part of the page title]')}`);
    request.value = [
      `Hi, could you help test a ${plan.name} change in Site Search?`,
      '',
      `Test Search App, language, and profile — ${text('scope', '[test Search App, language, and Search Profile]')}`,
      `Target page or pages — ${text('page', '[URL or title of each target page]')}`,
      ...queryLines,
      `Control query — ${text('control', '[query whose top results should stay the same]')}`,
      '',
      'Baseline in Preview',
      text('baseline', '[record the current top results and where the target appears for each query]'),
      '',
      'Expected change',
      text('expected', plan.expectedPrompt),
      '',
      'Confirm which App, language, and profile the live site uses. Use a Sandbox or staging App if available, and confirm the selected test profile serves no live searches.',
      ...plan.steps,
      '',
      'Please share the before-and-after results so we can review them before publishing to live search.',
    ].join('\n');
    if (request.hidden) copyStatus.textContent = '';
  }

  for (const input of inputs) input.addEventListener('input', update);
  setupRequestCopy(copyButton, copyStatus, request, {
    copied: 'Test plan copied.',
    manual: 'Select and copy the test plan below.',
  });
  update();
}

for (const section of document.querySelectorAll<HTMLElement>('[data-lab-test-plan]')) {
  const kind = section.dataset.labTestPlan;
  if (kind === 'fields' || kind === 'ranking') setupTestPlan(section, kind);
}
