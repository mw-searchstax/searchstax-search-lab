import { metadataLabel, orderedMetadata, type MetadataField, type MetadataStyle } from './card-metadata';
import type { DesignSettings } from './design';

export function setupCardEditor(root: HTMLElement, preview: () => HTMLElement, getDesign: () => DesignSettings, update: () => void) {
  const control = <T extends HTMLElement>(id: string) => root.querySelector<T>('#lab-' + id)!;
  const field = control<HTMLSelectElement>('metadata-field');
  const order = control<HTMLSelectElement>('metadata-order');
  const label = control<HTMLInputElement>('metadata-label');
  const earlier = control<HTMLButtonElement>('metadata-up');
  const later = control<HTMLButtonElement>('metadata-down');
  const reset = control<HTMLButtonElement>('metadata-reset');
  const color = control<HTMLInputElement>('ribbon-color');
  const accent = control<HTMLInputElement>('ribbon-accent');
  const customColor = control('ribbon-custom');
  const thumbnailSize = control<HTMLSelectElement>('thumbnail-size');
  const sampleThumbnails = control('thumbnails').closest<HTMLElement>('.search-lab__field')!;
  const thumbnailHint = control('thumbnail-hint');
  const fieldChoice = control('metadata-choice');
  const labelEditor = control('metadata-edit');
  const labelCaption = control('metadata-caption');
  const emptyMetadata = control('metadata-empty');
  const selects = [
    ['thumbnailSize', thumbnailSize],
    ['thumbnailPlacement', control<HTMLSelectElement>('thumbnail-placement')],
    ['ribbonShape', control<HTMLSelectElement>('ribbon-shape')],
  ] as const;
  for (const [key, select] of selects) {
    select.addEventListener('change', () => {
      Object.assign(getDesign(), { [key]: select.value });
      update();
    });
  }
  color.addEventListener('input', () => { getDesign().ribbonColor = color.value; update(); });
  let lastCustomColor = '';
  accent.addEventListener('change', () => {
    const design = getDesign();
    if (accent.checked) lastCustomColor = design.ribbonColor;
    design.ribbonColor = accent.checked ? '' : lastCustomColor || design.color;
    update();
  });

  let current: MetadataStyle;
  let fields: MetadataField[] = [];
  let previousOptions = '';
  function refresh() {
    const design = getDesign();
    for (const [key, select] of selects) select.value = design[key];
    color.value = design.ribbonColor || design.color;
    accent.checked = !design.ribbonColor;
    customColor.hidden = accent.checked;
    const panel = preview();
    const canEnableSamples = !sampleThumbnails.hidden && !design.showThumbnails;
    thumbnailHint.hidden = canEnableSamples || [...panel.querySelectorAll('.mapped-result-card > img')]
      .some(img => getComputedStyle(img).display !== 'none');
    if (thumbnailHint.hidden) thumbnailSize.removeAttribute('aria-describedby');
    else thumbnailSize.setAttribute('aria-describedby', thumbnailHint.id);
    const groups = panel.querySelectorAll<HTMLElement>('[data-card-scope]');
    const scope = groups[0]?.dataset.cardScope || '';
    const selectionChanged = current?.scope !== scope;
    current = design.cardMetadata.find(item => item.scope === scope) ?? { scope, order: [], labels: {} };
    const available = new Map<string, MetadataField>();
    for (const group of groups) {
      const lines = [...group.querySelectorAll<HTMLElement>('[data-card-field]')].map(el => ({
        name: el.dataset.cardField!, label: el.dataset.cardLabel!, position: Number(el.dataset.cardPosition), el,
      }));
      const sorted = orderedMetadata(lines, current);
      for (const row of sorted) {
        available.set(row.name, row);
        const value = metadataLabel(row, current);
        const prefix = value ? value + ': ' : '';
        if (row.el.firstChild!.textContent !== prefix) row.el.firstChild!.textContent = prefix;
      }
      if (lines.some((row, index) => sorted[index] !== row)) group.append(...sorted.map(row => row.el));
    }
    fields = orderedMetadata([...available.values()], current);
    const signature = JSON.stringify([scope, fields.map(f => [f.name, f.label])]);
    if (signature !== previousOptions) {
      for (const select of [field, order]) {
        const selected = select.value;
        select.replaceChildren(...fields.map(f => new Option(f.label || f.name, f.name)));
        if (!fields.length) select.add(new Option('No metadata in these results', ''));
        if (!selectionChanged && available.has(selected)) select.value = selected;
        select.disabled = !fields.length;
      }
      previousOptions = signature;
    }
    const selected = available.get(field.value);
    fieldChoice.hidden = fields.length < 2;
    labelEditor.hidden = !selected;
    emptyMetadata.hidden = Boolean(selected);
    labelCaption.textContent = fields.length === 1 && selected ? 'Label for ' + (selected.label || selected.name) : 'Metadata label';
    label.disabled = !selected;
    label.placeholder = selected?.label || '';
    const override = Object.hasOwn(current.labels, field.value) ? current.labels[field.value] : '';
    if (label.value !== override) label.value = override;
    const index = fields.findIndex(f => f.name === order.value);
    earlier.disabled = index <= 0;
    later.disabled = index < 0 || index === fields.length - 1;
    reset.disabled = !current.order.length;
  }
  function save(style: MetadataStyle) {
    const design = getDesign();
    design.cardMetadata = design.cardMetadata.filter(item => item.scope !== style.scope);
    if (style.order.length || Object.keys(style.labels).length) design.cardMetadata.push(style);
    update();
  }
  field.addEventListener('change', refresh);
  order.addEventListener('change', refresh);
  label.addEventListener('input', () => {
    const { [field.value]: previous, ...others } = current.labels;
    save({ ...current, labels: label.value ? { ...others, [field.value]: label.value } : others });
  });
  function move(delta: number) {
    const names = [...new Set([...current.order, ...fields.map(f => f.name)])];
    const at = names.indexOf(order.value);
    const next = fields[fields.findIndex(f => f.name === order.value) + delta];
    if (!next) return;
    const to = names.indexOf(next.name);
    [names[at], names[to]] = [names[to], names[at]];
    save({ ...current, order: names });
    if (delta < 0 ? earlier.disabled : later.disabled) order.focus();
  }
  earlier.addEventListener('click', () => move(-1));
  later.addEventListener('click', () => move(1));
  reset.addEventListener('click', () => { save({ ...current, order: [] }); order.focus(); });

  // The widget can replace or append its result elements after its search callback returns.
  const hasCard = (node: Node) => node instanceof Element &&
    (node.matches('.mapped-result-card') || Boolean(node.querySelector('.mapped-result-card')));
  new MutationObserver(records => {
    if (records.some(record => record.type === 'attributes' || [...record.addedNodes, ...record.removedNodes].some(hasCard))) refresh();
  }).observe(root.querySelector('#lab-preview')!, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-unavailable'] });
  return refresh;
}
