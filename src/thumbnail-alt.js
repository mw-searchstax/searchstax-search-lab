/** Read a thumbnail description from the original returned document. */
export function thumbnailAlt(document, fieldName, decorative) {
  if (!fieldName) return decorative ? '' : null;
  const value = Array.isArray(document) ? document.find(field => field.key === fieldName)?.value
    : Object.hasOwn(document, fieldName) ? document[fieldName] : undefined;
  const values = Array.isArray(value) ? value : [value];
  const text = values.find(entry => typeof entry === 'string' && entry.trim().length > 0);
  return text?.trim() || (decorative ? '' : null);
}
