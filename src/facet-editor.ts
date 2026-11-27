import { orderedFacetGroups, type FacetGroup } from './facet-groups';
import type { DesignSettings } from './design';

type Context = { scope: string; groups: FacetGroup[] };

export function setupFacetEditor(root: HTMLElement, context: () => Context, design: () => DesignSettings, update: () => void) {
  const picker = root.querySelector<HTMLSelectElement>('#lab-facet-group')!;
  const editor = root.querySelector<HTMLElement>('#lab-facet-group-editor')!;
  const empty = root.querySelector<HTMLElement>('#lab-facet-group-empty')!;
  const show = root.querySelector<HTMLInputElement>('#lab-facet-group-show')!;
  const caption = root.querySelector<HTMLLabelElement>('label[for="lab-facet-group-show"]')!;
  const earlier = root.querySelector<HTMLButtonElement>('#lab-facet-group-up')!;
  const later = root.querySelector<HTMLButtonElement>('#lab-facet-group-down')!;
  const reset = root.querySelector<HTMLButtonElement>('#lab-facet-group-reset')!;
  let previousScope: string;
  let signature = '';

  function selection() {
    const { scope, groups } = context();
    const style = design().facetGroups.find(item => item.scope === scope);
    return { scope, groups, style, names: style?.fields ?? groups.map(group => group.field) };
  }

  function refresh() {
    const { scope, groups, style, names } = selection();
    const visible = orderedFacetGroups(groups, names);
    const choices = [...visible, ...groups.filter(group => !names.includes(group.field))];
    const next = JSON.stringify([scope, choices]);
    if (next !== signature) {
      const previous = picker.value;
      picker.replaceChildren(...choices.map(group => new Option(group.label, group.field)));
      if (scope === previousScope && choices.some(group => group.field === previous)) picker.value = previous;
      signature = next;
      previousScope = scope;
    }
    editor.hidden = !choices.length;
    empty.hidden = Boolean(choices.length);
    picker.closest<HTMLElement>('.search-lab__field')!.hidden = choices.length < 2;
    const field = choices.find(group => group.field === picker.value);
    caption.textContent = choices.length === 1 && field ? 'Show ' + field.label : 'Show this group';
    const index = visible.findIndex(group => group.field === picker.value);
    show.checked = index >= 0;
    earlier.disabled = index <= 0;
    later.disabled = index < 0 || index === visible.length - 1;
    reset.disabled = !style;
  }

  function save(scope: string, fields?: string[]) {
    const current = design();
    current.facetGroups = current.facetGroups.filter(style => style.scope !== scope);
    if (fields) current.facetGroups.push({ scope, fields });
    update();
  }

  function move(delta: number) {
    const { scope, groups, names } = selection();
    const visible = orderedFacetGroups(groups, names);
    const index = visible.findIndex(group => group.field === picker.value);
    const other = index >= 0 && visible[index + delta];
    if (!other) return;
    const fields = [...names];
    const from = fields.indexOf(picker.value);
    const to = fields.indexOf(other.field);
    [fields[from], fields[to]] = [fields[to], fields[from]];
    save(scope, fields);
    if (delta < 0 ? earlier.disabled : later.disabled) picker.focus();
  }

  picker.addEventListener('change', refresh);
  show.addEventListener('change', () => {
    const { scope, names } = selection();
    save(scope, show.checked ? [...names, picker.value] : names.filter(name => name !== picker.value));
  });
  earlier.addEventListener('click', () => move(-1));
  later.addEventListener('click', () => move(1));
  reset.addEventListener('click', () => {
    save(context().scope);
    if (picker.options.length > 1) picker.focus();
    else show.focus();
  });
  return refresh;
}
