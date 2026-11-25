import type { DesignSettings } from './design';

export interface ResultWindow {
  total: number;
  start: number; // Zero-based offset of the first displayed batch.
  visible: number;
  query?: string;
  spanish?: boolean;
}

export function formatResultSummary(mode: DesignSettings['summaryMode'], { total, start, visible, query = '', spanish = false }: ResultWindow) {
  const end = Math.min(total, start + visible);
  const count = total + (spanish ? (total === 1 ? ' resultado' : ' resultados') : (total === 1 ? ' result' : ' results'));
  const text = mode === 'range' && visible > 0 && end > start
    ? (spanish ? 'Mostrando ' : 'Showing ') + (start + 1) + '–' + end + (spanish ? ' de ' : ' of ') + total
    : count;
  return query ? text + (spanish ? ' para ' : ' for ') + '“' + query + '”' : text;
}

export function placeResultSummary(element: HTMLElement, placement: DesignSettings['summaryPlacement'], toolbar: HTMLElement, results: HTMLElement) {
  if (placement === 'below') {
    if (element.previousElementSibling !== results) results.after(element);
  } else if (element.parentElement !== toolbar) {
    toolbar.prepend(element);
  }
}
