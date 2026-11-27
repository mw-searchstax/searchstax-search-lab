import type { DesignSettings } from './design.js';
import { thumbnailAlt } from './thumbnail-alt.js';
import { webURL } from './web-url.js';
import { metadataLabel, metadataScope, orderedMetadata, type MetadataStyle, type MetadataField } from './card-metadata.js';

export type ResultField = { name: string; result_card?: string | null; title?: string };
export type CardValue = MetadataField & { role: string; label: string; value: string; highlighted: boolean };
export type ThumbnailPolicy = { thumbnailAltField?: string; thumbnailsWithoutAltAreDecorative?: boolean };
export type ResultCard = { scope: string; url: string; thumbnail: string; alt?: string; sampleThumbnail?: string; values: CardValue[]; promoted: boolean };

function displayText(value: unknown, separator = ', '): string {
  if (Array.isArray(value)) return value.map(item => displayText(item)).filter(Boolean).join(separator);
  return ['number', 'string', 'boolean'].includes(typeof value) ? String(value) : '';
}

export function mapResultCard(doc: Record<string, unknown>, fields: ResultField[], highlights?: Record<string, unknown>, unit = '', scope = ''): ResultCard {
  const card: ResultCard = { scope, url: '', thumbnail: '', values: [], promoted: doc['[elevated]'] === true };
  const mapped = new Set<string>();
  for (const [position, field] of fields.entries()) {
    if (!field || typeof field.name !== 'string' || (!Object.hasOwn(doc, field.name) && !Object.hasOwn(highlights ?? {}, field.name))) continue;
    const role = field.result_card ?? '';
    if (role && mapped.has(role)) continue;
    mapped.add(role);
    const raw = displayText(doc[field.name], role === 'paths' ? ' / ' : ', ');
    if (role === 'url' || role === 'thumbnail') {
      card[role] = webURL(raw) || '';
      continue;
    }
    const hit = displayText(highlights?.[field.name], ' ');
    let value = hit || raw;
    if (!value) continue;
    if (role === 'distance') {
      if (!Number.isFinite(Number(raw))) continue;
      value = [Math.floor(Number(raw)), unit].filter(value => value !== '').join(' ');
    }
    card.values.push({ name: field.name, position, role, label: typeof field.title === 'string' ? field.title : '', value, highlighted: !!hit });
  }
  return card;
}

export type ResultResponse = {
  metadata?: { results?: ResultField[]; locationSearch?: { unit?: string } };
  responseHeader?: { params?: { uniqueId?: string; hl?: string | boolean; model?: string; language?: string } };
  highlighting?: Record<string, Record<string, unknown>>;
};

export function resultCards(payload: ResultResponse, documents: Record<string, unknown>[], configured?: boolean, profile?: string, language?: string, policy?: ThumbnailPolicy) {
  const fields = payload.metadata?.results;
  const mappingsKnown = Array.isArray(fields);
  const params = payload.responseHeader?.params;
  const hl = params?.hl;
  const responseSetting = String(hl) === 'true' ? true : String(hl) === 'false' ? false : undefined;
  const highlighting = configured ?? responseSetting;
  const cards = documents.map(doc => {
    const key = params?.uniqueId;
    const id = key && doc?.[key];
    const hits = highlighting === true && (typeof id === 'string' || typeof id === 'number') ? payload.highlighting?.[id] : undefined;
    const card = mapResultCard(doc ?? {}, mappingsKnown ? fields : [], hits, payload.metadata?.locationSearch?.unit,
      metadataScope(profile || params?.model, language || params?.language));
    if (card.thumbnail) {
      const alt = thumbnailAlt(doc, policy?.thumbnailAltField, policy?.thumbnailsWithoutAltAreDecorative ?? true);
      if (alt === null) card.thumbnail = '';
      else card.alt = alt;
    }
    return card;
  });
  return { cards, mappingsKnown, highlighting, hasThumbnailMapping: mappingsKnown && fields.some(field => field?.result_card === 'thumbnail') };
}

export function resultMappingNotice(mappingsKnown: boolean, displayed: number, total: number) {
  if (!mappingsKnown) return 'Results Fields are unknown for this profile.';
  return !displayed && total > 0 ? 'No configured Results Fields have a displayable value on this page.' : '';
}

// Only the search service’s bare emphasis tags are markup. Everything else is text.
export function passageParts(value: string, highlighted = false) {
  if (!highlighted) return [{ text: value, matched: false }];
  let depth = 0;
  const parts: { text: string; matched: boolean }[] = [];
  for (const token of value.split(/(<\/?(?:em|mark|b|strong)>)/ig)) {
    if (!token) continue;
    if (/^<(?:em|mark|b|strong)>$/i.test(token)) depth++;
    else if (/^<\/(?:em|mark|b|strong)>$/i.test(token)) depth = Math.max(0, depth - 1);
    else parts.push({ text: token, matched: depth > 0 });
  }
  return parts;
}

function appendValue(node: HTMLElement, field: CardValue) {
  for (const part of passageParts(field.value, field.highlighted)) {
    if (part.matched) {
      const mark = document.createElement('mark');
      mark.className = 'search-result-hit';
      mark.textContent = part.text;
      node.append(mark);
    } else node.append(part.text);
  }
}

function setLinkTarget(link: HTMLAnchorElement, target: DesignSettings['resultLinkTarget']) {
  link.target = target;
  if (target === '_blank') link.rel = 'noopener noreferrer';
  else link.removeAttribute('rel');
}

export function updateResultLinkTargets(host: ParentNode, target: DesignSettings['resultLinkTarget']) {
  for (const link of host.querySelectorAll<HTMLAnchorElement>('a.searchstax-search-result-title')) setLinkTarget(link, target);
}

export function appendResultCard(node: HTMLElement, card: ResultCard, styles: MetadataStyle[] = [], target: DesignSettings['resultLinkTarget'] = '_self') {
  node.classList.add('mapped-result-card');
  const thumbnail = card.thumbnail || card.sampleThumbnail;
  if (thumbnail) {
    const image = document.createElement('img');
    image.src = thumbnail;
    image.className = 'mapped-result-thumbnail';
    if (card.sampleThumbnail) image.classList.add('profile-result-thumbnail');
    image.alt = card.alt || '';
    image.loading = 'lazy';
    image.referrerPolicy = 'no-referrer';
    node.append(image);
  }
  const content = document.createElement('div');
  content.className = 'result-card-content';
  node.append(content);
  const ribbon = card.values.find(field => field.role === 'ribbon');
  if (ribbon) {
    const badge = document.createElement('span');
    badge.className = 'searchstax-search-result-ribbon';
    appendValue(badge, ribbon);
    content.append(badge);
  }
  const title = card.values.find(field => field.role === 'title');
  if (title || card.url) {
    const heading = document.createElement('h4');
    const name = card.url ? document.createElement('a') : document.createElement('span');
    name.className = 'searchstax-search-result-title';
    if (name instanceof HTMLAnchorElement) {
      name.href = card.url;
      setLinkTarget(name, target);
      name.referrerPolicy = 'no-referrer';
    }
    if (title) appendValue(name, title);
    else name.textContent = card.url;
    heading.append(name);
    content.append(heading);
  }
  const style = styles.find(item => item.scope === card.scope);
  const metadata = document.createElement('div');
  metadata.dataset.cardScope = card.scope;
  const description = card.values.find(field => field.role === 'description');
  const fields = orderedMetadata(card.values.filter(field => !['title', 'ribbon', 'description'].includes(field.role)), style);
  for (const field of description ? [description, ...fields] : fields) {
    const line = document.createElement('p');
    if (field.role === 'description') {
      line.className = 'search-lab__result-description';
      if (field.label) line.append(field.label + ': ');
    } else {
      line.dataset.cardField = field.name;
      line.dataset.cardLabel = field.label;
      line.dataset.cardPosition = String(field.position);
      const label = document.createElement('span');
      const text = metadataLabel(field, style);
      label.textContent = text ? text + ': ' : '';
      line.append(label);
    }
    if (field.role === 'paths' || field.role === 'date' || field.role === 'distance') line.className = 'mapped-result-' + field.role;
    const imageURL = !field.role && /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(field.value) ? webURL(field.value) : null;
    if (imageURL) {
      const image = document.createElement('img');
      image.className = 'mapped-result-thumbnail';
      image.src = imageURL;
      image.alt = '';
      image.referrerPolicy = 'no-referrer';
      line.append(image);
    } else if (field.role === 'date' && /^\d{4}-\d{2}-\d{2}(?:T\S+)?$/.test(field.value) && Number.isFinite(Date.parse(field.value))) {
      const time = document.createElement('time');
      time.dateTime = field.value;
      time.textContent = field.value;
      line.append(time);
    } else appendValue(line, field);
    (field.role === 'description' ? content : metadata).append(line);
  }
  if (fields.length) content.append(metadata);
}

// Widget templates can replace their image nodes between searches. Capture image
// events at the result host, including loads when a framework reuses a failed img.
export function watchCardThumbnails(host: HTMLElement) {
  function update(event: Event) {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || !image.matches('.mapped-result-thumbnail, .search-starter__result-thumbnail, .search-lab__result-thumbnail')) return;
    image.toggleAttribute('data-unavailable', event.type === 'error');
    if (event.type === 'error') image.loading = 'eager';
  }
  host.addEventListener('error', update, true);
  host.addEventListener('load', update, true);
  return () => {
    host.removeEventListener('error', update, true);
    host.removeEventListener('load', update, true);
  };
}
