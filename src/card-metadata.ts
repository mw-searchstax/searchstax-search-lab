export type MetadataStyle = { scope: string; order: string[]; labels: Record<string, string> };
export type MetadataField = { name: string; label: string; position: number };

export function metadataScope(profile = '', language = '') {
  return JSON.stringify([profile, language.toLowerCase().replaceAll('_', '-')]);
}

export function readMetadataStyles(value: string | null): MetadataStyle[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(style => style && typeof style.scope === 'string' &&
      Array.isArray(style.order) && style.order.every((name: unknown) => typeof name === 'string') &&
      style.labels && typeof style.labels === 'object' && !Array.isArray(style.labels) &&
      Object.values(style.labels).every(label => typeof label === 'string'));
  } catch { return []; }
}

export function orderedMetadata<T extends MetadataField>(fields: T[], style?: MetadataStyle): T[] {
  const order = new Map(style?.order.map((name, index) => [name, index]));
  const rank = (name: string) => order.get(name) ?? order.size;
  return [...fields].sort((a, b) => rank(a.name) - rank(b.name) || a.position - b.position);
}

export function metadataLabel(field: MetadataField, style?: MetadataStyle) {
  return style && Object.hasOwn(style.labels, field.name) ? style.labels[field.name] : field.label;
}
