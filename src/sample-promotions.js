const demoSite = 'https://mw-searchstax.github.io/university-health-search-demo/';
const indexedNotice = demoSite + 'news/flu-clinic-update-2026/';

export const samplePromotionQuery = 'campus flu clinic';
export const sampleExternalPromotion = {
  url: demoSite + 'care/resources/flu-shot-appointments/',
  title: 'Read the fictional flu shot appointment notice',
};

export function samplePromotionMode(query, setting) {
  const normalized = typeof query === 'string' ? query.trim().toLowerCase().replace(/\s+/g, ' ') : '';
  return normalized === samplePromotionQuery ? setting : 'off';
}

export function applySampleIndexedPromotion(items, response, mode) {
  if (mode !== 'indexed' && mode !== 'both') return items;
  const sort = response.responseHeader?.params?.sort;
  if (response.response.start !== 0 || (sort && sort !== 'score desc')) return items;
  const index = items.findIndex(item => item.url === indexedNotice);
  if (index === -1) return items;
  return [{ ...items[index], sampleIndexedPromotion: true }, ...items.slice(0, index), ...items.slice(index + 1)];
}

export function createSampleExternalPromotion() {
  const banner = document.createElement('section');
  banner.className = 'sample-external-promotion search-promotion-banner';
  banner.setAttribute('aria-label', 'Sample external promotion');
  banner.hidden = true;
  const label = document.createElement('p');
  label.className = 'sample-external-promotion__label';
  label.textContent = 'Sample external promotion';
  const link = document.createElement('a');
  link.href = sampleExternalPromotion.url;
  link.textContent = sampleExternalPromotion.title;
  banner.append(label, link);
  return banner;
}

export function updateSampleExternalPromotion(banner, mode) {
  banner.hidden = mode !== 'external' && mode !== 'both';
}
