import type { DesignSettings } from './design.js';

type Limits = Pick<DesignSettings, 'facetDesktop' | 'facetMobile'>;

// Each kit supplies the facet rows and owns their selection. The Lab's responsive
// templates use one list on both screen sizes, including inside the Help Center iframe.
export function setupFacetLimits(host: HTMLElement, settings: () => Limits) {
  const mobile = matchMedia('(max-width: 850px)');
  const expanded = new Set<string>();

  function refresh() {
    const limit = mobile.matches ? settings().facetMobile : settings().facetDesktop;
    for (const list of host.querySelectorAll<HTMLElement>('.search-facet-choices')) {
      const group = list.closest('fieldset');
      if (!group) continue;
      const key = group.dataset.facet || group.querySelector('legend')?.textContent || '';
      const rows = Array.from(list.children) as HTMLElement[];
      for (const [index, row] of rows.entries()) {
        row.hidden = index >= limit && !expanded.has(key) && !row.querySelector('input:checked');
      }
      let button = group.querySelector<HTMLButtonElement>('button[data-facet-more]');
      if (!button && rows.length > limit) {
        button = document.createElement('button');
        button.type = 'button';
        button.dataset.facetMore = key;
        list.after(button);
      }
      if (button) {
        button.hidden = rows.length <= limit;
        const open = expanded.has(key);
        const spanish = group.closest('[lang]')?.getAttribute('lang')?.startsWith('es');
        const label = spanish ? (open ? 'Mostrar menos' : 'Mostrar más') : (open ? 'Show less' : 'Show more');
        if (button.textContent !== label) button.textContent = label;
        button.setAttribute('aria-expanded', String(open));
        button.setAttribute('aria-label', label + ' · ' + (group.querySelector('legend')?.textContent || key));
      }
    }
  }
  function toggle(event: MouseEvent) {
    const button = event.target instanceof Element && event.target.closest<HTMLButtonElement>('button[data-facet-more]');
    if (!button) return;
    const key = button.dataset.facetMore!;
    if (expanded.has(key)) expanded.delete(key);
    else expanded.add(key);
    refresh();
  }
  const observer = new MutationObserver(refresh);
  observer.observe(host, { childList: true, subtree: true });
  mobile.addEventListener('change', refresh);
  host.addEventListener('click', toggle);
  refresh();
  return {
    refresh,
    reset() { expanded.clear(); refresh(); },
    destroy() {
      observer.disconnect();
      mobile.removeEventListener('change', refresh);
      host.removeEventListener('click', toggle);
    },
  };
}
