import { contentLanguageTag } from './content-language.js';

/**
 * @typedef {Object} SuggestionPayload
 * @property {{ enabled?: boolean, minPrefixChars?: number }} [metadata]
 * @property {Record<string, Record<string, { suggestions?: { term?: unknown }[] }>>} [suggest]
 */

/**
 * @param {{ token: string, language: string }} connection
 * @param {string} endpoint
 */
export function createCustomerSuggestionSource(connection, endpoint) {
  let minimumChars = 2;
  return {
    label: 'Search suggestions',
    language: contentLanguageTag(connection.language),
    delay: 250,
    get minimumChars() { return minimumChars; },
    /** @param {string} prefix @param {AbortSignal} signal */
    async suggest(prefix, signal) {
      const url = new URL(endpoint);
      url.searchParams.set('q', prefix);
      if (connection.language) url.searchParams.set('language', connection.language);
      const response = await fetch(url, {
        headers: { Authorization: 'Token ' + connection.token },
        credentials: 'omit',
        redirect: 'error',
        referrerPolicy: 'no-referrer',
        cache: 'no-store',
        signal: AbortSignal.any([signal, AbortSignal.timeout(5000)]),
      });
      if (!response.ok) throw new Error('Unable to fetch suggestions');
      /** @type {SuggestionPayload} */
      const payload = await response.json();
      if (payload?.metadata?.enabled === false) throw new Error('Auto-Suggest is disabled');
      const configuredMinimum = payload?.metadata?.minPrefixChars;
      if (typeof configuredMinimum === 'number' && Number.isSafeInteger(configuredMinimum) && configuredMinimum > 0) {
        minimumChars = configuredMinimum;
      }

      const seen = new Set([prefix.toLowerCase()]);
      /** @type {string[]} */
      const suggestions = [];
      for (const dictionary of Object.values(payload?.suggest ?? {})) {
        for (const match of Object.values(dictionary ?? {})) {
          if (!Array.isArray(match?.suggestions)) continue;
          for (const suggestion of match.suggestions) {
            if (typeof suggestion?.term !== 'string') continue;
            const term = suggestion.term.trim();
            const key = term.toLowerCase();
            if (!term || seen.has(key)) continue;
            seen.add(key);
            suggestions.push(term);
            if (suggestions.length === 8) return suggestions;
          }
        }
      }
      return suggestions;
    },
  };
}
