import { passageParts, resultCards } from './result-card.js';
import { demoResultText, demoResultTitle } from './demo-content.js';

// Use the raw profile response so a kit-normalized description cannot discard the passage.
export function starterPassages(response, demo) {
  const documents = response?.response?.docs ?? [];
  const key = response?.responseHeader?.params?.uniqueId;
  const { cards } = resultCards(response, documents);
  const byId = new Map();
  if (key) documents.forEach((doc, i) => byId.set(String(doc[key]), cards[i]));
  return item => {
    const values = byId.get(String(item.uniqueId))?.values ?? [];
    function parts(role, fallback = '') {
      const field = values.find(value => value.role === role);
      if (field) return passageParts(field.value, field.highlighted);
      const value = String(fallback ?? '');
      const text = demo ? (role === 'title' ? demoResultTitle(value) : demoResultText(value)) : value;
      return passageParts(text);
    }
    const ribbonParts = parts('ribbon', item.ribbon).filter(part => part.text);
    return {
      titleParts: parts('title', item.title || item.url),
      descriptionParts: parts('description', item.description).filter(part => part.text),
      hasRibbon: ribbonParts.length > 0,
      ribbonParts,
      otherFields: values.filter(field => !['title', 'description', 'ribbon'].includes(field.role))
        .map(field => ({ label: field.label, parts: passageParts(field.value, field.highlighted) })),
    };
  };
}
