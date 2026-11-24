import { webURL } from './web-url.js';

export type ResultField = { name: string; result_card?: string | null; title?: string };
export type CardValue = { role: string; label: string; value: string; highlighted: boolean };
export type ResultCard = { url: string; thumbnail: string; values: CardValue[]; promoted: boolean };

function displayText(value: unknown, separator = ', '): string {
  if (Array.isArray(value)) return value.map(item => displayText(item)).filter(Boolean).join(separator);
  return ['number', 'string', 'boolean'].includes(typeof value) ? String(value) : '';
}

export function mapResultCard(doc: Record<string, unknown>, fields: ResultField[], highlights?: Record<string, unknown>, unit = ''): ResultCard {
  const card: ResultCard = { url: '', thumbnail: '', values: [], promoted: doc['[elevated]'] === true };
  const mapped = new Set<string>();
  for (const field of fields) {
    if (!field || typeof field.name !== 'string' || !Object.hasOwn(doc, field.name)) continue;
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
    card.values.push({ role, label: typeof field.title === 'string' ? field.title : '', value, highlighted: !!hit });
  }
  return card;
}

export type ResultResponse = {
  metadata?: { results?: ResultField[]; locationSearch?: { unit?: string } };
  responseHeader?: { params?: { uniqueId?: string; hl?: string | boolean; model?: string; language?: string } };
  highlighting?: Record<string, Record<string, unknown>>;
};

export function resultCards(payload: ResultResponse, documents: Record<string, unknown>[], configured?: boolean) {
  const fields = payload.metadata?.results;
  const mappingsKnown = Array.isArray(fields);
  const params = payload.responseHeader?.params;
  const hl = params?.hl;
  const responseSetting = String(hl) === 'true' ? true : String(hl) === 'false' ? false : undefined;
  const highlighting = configured ?? responseSetting;
  const cards = documents.map(doc => {
    const key = params?.uniqueId;
    const id = key && doc?.[key];
    const hits = highlighting !== false && (typeof id === 'string' || typeof id === 'number') ? payload.highlighting?.[id] : undefined;
    return mapResultCard(doc ?? {}, mappingsKnown ? fields : [], hits, payload.metadata?.locationSearch?.unit);
  });
  return { cards, mappingsKnown, highlighting };
}

// Preserve highlight boundaries without parsing result content as HTML.
function appendValue(node: HTMLElement, field: CardValue) {
  if (!field.highlighted) { node.append(field.value); return; }
  let highlight: HTMLElement | null = null;
  for (const part of field.value.split(/(<\/?(?:em|mark|b|strong)>)/ig)) {
    if (/^<(em|mark|b|strong)>$/i.test(part)) {
      highlight = document.createElement('mark');
      node.append(highlight);
    } else if (/^<\/(em|mark|b|strong)>$/i.test(part)) highlight = null;
    else (highlight || node).append(part);
  }
}

export function appendResultCard(node: HTMLElement, card: ResultCard) {
  node.classList.add('mapped-result-card');
  const ribbon = card.values.find(field => field.role === 'ribbon');
  if (ribbon) {
    const badge = document.createElement('span');
    badge.className = 'searchstax-search-result-ribbon';
    appendValue(badge, ribbon);
    node.append(badge);
  }
  if (card.thumbnail) {
    const image = document.createElement('img');
    image.src = card.thumbnail;
    image.className = 'mapped-result-thumbnail';
    image.alt = '';
    image.loading = 'lazy';
    image.referrerPolicy = 'no-referrer';
    node.append(image);
  }
  const title = card.values.find(field => field.role === 'title');
  if (title || card.url) {
    const heading = document.createElement('h4');
    const name = card.url ? document.createElement('a') : document.createElement('span');
    name.className = 'searchstax-search-result-title';
    if (name instanceof HTMLAnchorElement) {
      name.href = card.url;
      name.referrerPolicy = 'no-referrer';
    }
    if (title) appendValue(name, title);
    else name.textContent = card.url;
    heading.append(name);
    node.append(heading);
  }
  for (const field of card.values.filter(f => f.role !== 'title' && f.role !== 'ribbon').sort((a, b) => Number(!a.role) - Number(!b.role))) {
    const line = document.createElement('p');
    if (field.role === 'description') line.className = 'search-lab__result-description';
    if (field.label) line.append(field.label + ': ');
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
    node.append(line);
  }
}
