import { passageParts, resultCards } from './result-card.js';
import { metadataLabel, orderedMetadata } from './card-metadata.js';

// Project one card per displayable document. A kit's link or fallback title
// can't replace the profile's mapping when a particular field is missing.
export function starterResults(items, response, sampleImages, connection, styles = []) {
  const docs = response.response.docs;
  const { cards, hasThumbnailMapping } = resultCards(response, docs, undefined, connection.model, connection.language, connection);
  const idField = response.responseHeader?.params?.uniqueId;
  const byId = new Map(items.map(item => [String(item.uniqueId), item]));
  return cards.flatMap((card, index) => {
    const doc = docs[index];
    const uniqueId = idField ? doc[idField] : items[index]?.uniqueId;
    const item = byId.get(String(uniqueId)) ?? items[index];
    const fields = card.values;
    const parts = role => {
      const field = fields.find(value => value.role === role);
      return field ? passageParts(field.value, field.highlighted) : [];
    };
    const previewThumbnail = card.thumbnail || (!hasThumbnailMapping && sampleImages?.[card.url]) || '';
    if (!card.url && !fields.length && !previewThumbnail) return [];
    const title = parts('title');
    const ribbonParts = parts('ribbon');
    const descriptionParts = parts('description');
    const style = styles.find(item => item.scope === card.scope);
    return [{
      ...item, uniqueId: item?.uniqueId ?? uniqueId, url: card.url,
      previewThumbnail, previewThumbnailAlt: card.alt || '',
      promoted: card.promoted, titleParts: title.length ? title : card.url ? passageParts(card.url) : [],
      hasTitle: Boolean(title.length || card.url), hasRibbon: Boolean(ribbonParts.length), ribbonParts,
      descriptionParts, hasDescription: Boolean(descriptionParts.length),
      otherFields: orderedMetadata(fields.filter(field => !['title', 'description', 'ribbon'].includes(field.role)), style)
        .map(field => ({ label: metadataLabel(field, style), parts: passageParts(field.value, field.highlighted) })),
    }];
  });
}
