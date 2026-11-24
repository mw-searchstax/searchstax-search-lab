/**
 * @param {{ key: string, value: unknown }[]} fields
 * @param {string} fieldName
 * @param {boolean} decorative
 * @returns {string | null}
 */
export function thumbnailAlt(fields, fieldName, decorative) {
  const value = fieldName ? fields.find(field => field.key === fieldName)?.value : undefined;
  const values = Array.isArray(value) ? value : [value];
  const text = values.find(entry => typeof entry === 'string' && entry.trim().length > 0);
  return text?.trim() || (decorative ? '' : null);
}
