import { webURL } from './web-url.js';
import type { DesignSettings } from './design.js';

type Entry = { url: string; title: string; description: string };
type Labels = Pick<DesignSettings, 'promotionHeading' | 'promotionBadge'>;

export function promotionEntries(items?: { url?: unknown; name?: unknown; description?: unknown }[]): Entry[] {
  function text(value: unknown): string {
    const first = Array.isArray(value) ? value.find(item => typeof item === 'string') : value;
    return typeof first === 'string' ? first.trim() : '';
  }
  return (Array.isArray(items) ? items : []).flatMap(item => {
    const url = webURL(text(item?.url));
    return url ? [{ url, title: text(item.name) || url, description: text(item.description) }] : [];
  });
}

export function renderPromotionBanners(host: HTMLElement, entries: Entry[], heading: string, language?: string, openInNewTab = false) {
  host.replaceChildren(...entries.map(entry => {
    const banner = document.createElement('section');
    banner.className = 'search-promotion-banner';
    banner.setAttribute('aria-label', heading);
    const label = document.createElement('strong');
    label.className = 'search-promotion-heading';
    label.textContent = heading;
    const link = document.createElement('a');
    link.href = entry.url;
    link.referrerPolicy = 'no-referrer';
    if (openInNewTab) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    link.textContent = entry.title;
    if (language) link.lang = language;
    banner.append(label, link);
    if (entry.description) {
      const description = document.createElement('p');
      description.textContent = entry.description;
      if (language) description.lang = language;
      banner.append(description);
    }
    return banner;
  }));
  host.hidden = !entries.length;
}

export function placePromotionBanners(host: HTMLElement, results: HTMLElement, placement: string) {
  if (placement === 'below') {
    if (results.nextElementSibling !== host) results.after(host);
  } else if (results.previousElementSibling !== host) results.before(host);
}

export function updatePromotionLabels(root: HTMLElement, design: Labels) {
  for (const badge of root.querySelectorAll<HTMLElement>('.search-promotion-marker, .sample-indexed-promotion')) {
    badge.textContent = design.promotionBadge === 'Promoted' ? badge.dataset.defaultLabel || 'Promoted' : design.promotionBadge;
  }
  for (const label of root.querySelectorAll<HTMLElement>('.search-promotion-heading, .sample-external-promotion__label')) {
    label.textContent = design.promotionHeading === 'Featured link' ? label.dataset.defaultLabel || 'Featured link' : design.promotionHeading;
    label.closest('.search-promotion-banner')?.setAttribute('aria-label', label.textContent);
  }
}
