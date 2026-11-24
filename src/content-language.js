/** @param {string | undefined} value */
export function contentLanguageTag(value) {
  if (!value) return undefined;
  try {
    return Intl.getCanonicalLocales(value.trim().replaceAll('_', '-'))[0];
  } catch {
    return undefined;
  }
}
