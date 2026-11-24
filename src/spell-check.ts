function setupSpellCheckExample(section: HTMLElement) {
  const noResults = section.querySelector<HTMLElement>('[data-spell-no-results]')!;
  const beforeResults = section.querySelector<HTMLElement>('[data-spell-before-results]')!;
  const afterResults = section.querySelector<HTMLElement>('[data-spell-after-results]')!;
  const correction = section.querySelector<HTMLElement>('[data-spell-correction]')!;
  const results = section.querySelector<HTMLTemplateElement>('[data-spell-results]')!;
  const status = section.querySelector<HTMLElement>('[data-spell-status]')!;
  beforeResults.append(results.content.cloneNode(true));
  afterResults.append(results.content.cloneNode(true));

  function renderExample(input: HTMLInputElement) {
    const typo = input.value === 'typo';
    noResults.hidden = !typo;
    beforeResults.hidden = typo;
    correction.hidden = !typo;
    status.textContent = typo
      ? 'Spell Check recovers 8 results for rehabilitation.'
      : 'Both searches return 8 results for rehabilitation.';
  }

  for (const input of section.querySelectorAll<HTMLInputElement>('input[name="spell-check-query"]')) {
    if (input.checked) renderExample(input);
    input.addEventListener('change', () => renderExample(input));
  }
}

const spellCheckExample = document.querySelector<HTMLElement>('[data-lab-screen="spell-check"]');
if (spellCheckExample) setupSpellCheckExample(spellCheckExample);
