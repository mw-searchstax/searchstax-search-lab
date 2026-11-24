import { setupRequestCopy } from './copy-checklist-request';

const EMPTY_FIELDS = {
  profile: '[test Search App and Search Profile]',
  query: '[trigger phrase]',
  longerQuery: '[exact longer query containing the trigger phrase]',
  controlQuery: '[exact unrelated control query]',
  page: '[indexed page title or URL]',
  baseline: '[first result and position of the intended page for each query]',
};

function teammateRequest(details: typeof EMPTY_FIELDS, match: string, guideURL: string): string {
  const { profile, query, longerQuery, controlQuery, page, baseline } = details;
  const matchLabel = match === 'exact' ? 'Exact Match' : match === 'contains' ? 'Contains' : 'Please help me choose';

  return [
    "Hi, could you help set up an indexed promotion so people searching for the phrase below see the intended page at the top of their results?",
    '',
    `Test Search App and Search Profile — ${profile}`,
    `Trigger phrase — ${query}`,
    `Match type — ${matchLabel}`,
    `Page to promote — ${page}`,
    `Longer query — ${longerQuery}`,
    `Control query — ${controlQuery}`,
    '',
    'Recorded baseline in Preview',
    baseline,
    '',
    "Please confirm which Search App and Search Profile the live site uses, including the default profile if the site doesn't specify one. Use a Sandbox or staging App if available, and confirm no live search uses the App and profile we'll test.",
    "Confirm or complete the baseline in Preview for the test profile using the three queries above. For each, record the first result and where the intended page appears, if at all.",
    "In the test Search App and profile, go to Optimizations → Promotions and select Create a Promotion. Name the promotion, select Create, and enter the trigger phrase and match type.",
    "Confirm the page is indexed and select it under Indexed Items. Select Save Draft, then publish to the confirmed test profile only.",
    "Repeat the same searches in Preview. Confirm the correct page is first in the regular results for the trigger phrase. The longer search should promote it only with Contains. The unrelated search should show no promotion for this page and the same first result as before.",
    '',
    "Please share the before-and-after results so we can review them before publishing to live search.",
    '',
    `Promotions guide — ${guideURL}`,
  ].join('\n');
}

function setupPromotionChecklist(section: HTMLElement) {
  const fields = (Object.keys(EMPTY_FIELDS) as (keyof typeof EMPTY_FIELDS)[]).map(name => ({
    name,
    input: section.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[data-promotion-input="${name}"]`),
  }));
  const matchInput = section.querySelector<HTMLSelectElement>('[data-promotion-request-match]');
  const copyButton = section.querySelector<HTMLButtonElement>('[data-promotion-copy]');
  const copyStatus = section.querySelector<HTMLElement>('[data-promotion-copy-status]');
  const request = section.querySelector<HTMLTextAreaElement>('[data-promotion-request]');
  const guideURL = section.querySelector<HTMLAnchorElement>('[data-promotion-guide]')!.href;

  function update() {
    const details = { ...EMPTY_FIELDS };
    for (const { name, input } of fields) {
      details[name] = input?.value.trim() || EMPTY_FIELDS[name];
    }
    if (request) request.value = teammateRequest(details, matchInput?.value ?? '', guideURL);
    if (copyStatus && request?.hidden) copyStatus.textContent = '';
  }

  for (const { input } of fields) input?.addEventListener('input', update);
  matchInput?.addEventListener('change', update);

  if (copyButton && copyStatus && request) {
    setupRequestCopy(copyButton, copyStatus, request, {
      copied: 'Request copied.',
      manual: 'Select and copy the request below.',
    });
  }

  update();
}

const checklistSection = document.querySelector<HTMLElement>('[data-promotion-checklist]');
if (checklistSection) setupPromotionChecklist(checklistSection);
