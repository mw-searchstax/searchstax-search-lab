export type FacetGroup = { field: string; label: string };
export type FacetGroupStyle = { scope: string; fields: string[] };

export function facetGroupScope(profile = '', language = '') {
  return JSON.stringify([profile, language.toLowerCase().replaceAll('_', '-')]);
}

export function readFacetGroupStyles(value: string | null): FacetGroupStyle[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(style => style && typeof style.scope === 'string' && Array.isArray(style.fields) &&
      style.fields.every((name: unknown) => typeof name === 'string' && /^[A-Za-z_][\w.-]*$/.test(name)))
      .map(style => ({ scope: style.scope, fields: [...new Set<string>(style.fields)] }));
  } catch {
    return [];
  }
}

export function selectedFacetGroups(styles: FacetGroupStyle[] = [], profile?: string, language?: string) {
  return styles.find(style => style.scope === facetGroupScope(profile, language))?.fields;
}

export function orderedFacetGroups<T extends FacetGroup>(groups: T[], selected?: string[]): T[] {
  if (!selected) return groups;
  const byName = new Map(groups.map(group => [group.field, group]));
  return selected.flatMap(name => {
    const group = byName.get(name);
    return group ? [group] : [];
  });
}

export function visibleFacetFilters<T>(filters: Map<string, T>, selected?: string[]) {
  if (!selected) return filters;
  return new Map([...filters].filter(([field]) => selected.includes(field)));
}
