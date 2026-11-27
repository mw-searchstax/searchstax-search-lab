import type { DesignSettings } from './design.js';
import type { BuildPage, BuildSearch } from './customer-search.js';
import { setupFacetLimits } from './facet-limits.js';
import { orderedFacetGroups } from './facet-groups.js';

export type FacetSelection = BuildSearch['filters'];
type Fields = BuildPage['facets'];

// The custom profile and connected previews receive facet metadata directly.
export function setupPublishedFacets(host: HTMLElement, settings: () => DesignSettings,
  change: (selection: FacetSelection, label: HTMLElement, input: HTMLInputElement) => void) {
  const limits = setupFacetLimits(host, settings);
  let baseline: Fields = [];
  let selection: FacetSelection = new Map();

  host.addEventListener('change', event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.dataset.customerFacet) return;
    const field = input.dataset.customerFacet;
    const next = new Map(selection);
    const values = new Set(next.get(field));
    if (input.checked) values.add(input.value);
    else values.delete(input.value);
    if (values.size) next.set(field, [...values]);
    else next.delete(field);
    selection = next;
    change(next, input.closest('label')!, input);
  });

  function render(fields: Fields, active: FacetSelection, visible?: string[]) {
    const focus = document.activeElement;
    selection = active;
    if (!active.size) baseline = fields;
    const mode = settings().facetMode;
    const groups: HTMLElement[] = [];
    for (const field of orderedFacetGroups(fields, visible)) {
      const selected = active.get(field.field) ?? [];
      const counts = new Map(field.choices.map(item => [item.value, item.count]));
      const choices = new Map<string, number>();
      if (mode !== 'and') {
        for (const item of baseline.find(item => item.field === field.field)?.choices ?? [])
          choices.set(item.value, item.count);
      }
      for (const [value, count] of counts) {
        if (!choices.has(value)) choices.set(value, count);
      }
      for (const value of selected) if (!choices.has(value)) choices.set(value, 0);
      if (!choices.size) continue;
      const group = document.createElement('fieldset');
      group.dataset.facet = field.field;
      const legend = document.createElement('legend');
      legend.textContent = field.label;
      const list = document.createElement('div');
      list.className = 'search-facet-choices';
      for (const [value, count] of choices) {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = value;
        input.dataset.customerFacet = field.field;
        input.checked = selected.includes(value);
        input.disabled = mode === 'showUnavailable' && !counts.get(value) && !input.checked;
        label.append(input, value + ' (' + count + ')');
        list.append(label);
      }
      group.append(legend, list);
      groups.push(group);
    }
    host.replaceChildren(...groups);
    limits.refresh();
    if (focus instanceof HTMLInputElement && focus.dataset.customerFacet) {
      Array.from(host.querySelectorAll('input')).find(input =>
        input.dataset.customerFacet === focus.dataset.customerFacet && input.value === focus.value)?.focus();
    }
  }

  return { render, refresh: limits.refresh, reset() { baseline = []; limits.reset(); render([], new Map()); } };
}
