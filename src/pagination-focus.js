/**
 * Maintain focus when the UI Kit replaces its pagination controls.
 * @template {{ page: number, itemsPerPage: number | undefined }} Search
 * @param {HTMLElement} host
 * @param {() => {
 *   dataLayer: { loading: boolean, searchObject: Search, setSearchObject: (search: Search) => void },
 *   search: (search: Search) => unknown
 * } | null | undefined} getSearch
 */
export function setupPaginationFocus(host, getSearch) {
  const announcement = host.querySelector('[data-page-announcement]');
  let pending;
  let frame;

  function changePage(event) {
    const button = event.target instanceof Element && event.target.closest('button[data-page-step]');
    const loadMore = event.target instanceof Element && event.target.closest('.searchstax-pagination-load-more');
    const api = getSearch();
    const current = api?.dataLayer.searchObject;
    if (loadMore) {
      if (pending?.loadMore) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (loadMore.matches(':disabled')) return;
      pending = { loadMore: true };
      host.focus({ preventScroll: true });
      return;
    }
    if (!button || button.disabled || !current?.itemsPerPage || api.dataLayer.loading) return;
    const range = host.querySelector('[data-page-range]');
    const from = Number(range?.dataset.pageStart);
    const step = button.dataset.pageStep;
    if (!Number.isSafeInteger(from) || from < 1 || (step !== 'previous' && step !== 'next')) return;
    const page = 1 + Math.floor((from - 1) / current.itemsPerPage) + (step === 'next' ? 1 : -1);
    if (document.activeElement === button || event.detail === 0) {
      pending = { range: range.textContent.trim(), step };
      if (announcement) announcement.textContent = '';
      host.focus({ preventScroll: true });
    }
    const search = { ...current, page };
    // A failed request can leave the requested page ahead of the displayed range.
    if (page === current.page) api.search(search);
    else api.dataLayer.setSearchObject(search);
  }

  function restoreAfterRender() {
    if (!pending || (!pending.loadMore && document.activeElement !== host)) return;
    if (pending.loadMore) {
      if (getSearch()?.dataLayer.loading) {
        frame ??= requestAnimationFrame(() => {
          frame = undefined;
          restoreAfterRender();
        });
        return;
      }
      // Native nextPage() briefly focuses body while the request is in flight.
      // If the visitor tabbed to another control meanwhile, leave their focus
      // alone rather than pulling it back into the result list.
      if (document.activeElement !== document.body && document.activeElement !== host) {
        pending = undefined;
        return;
      }
      const loadMoreButton = host.querySelector('.searchstax-pagination-load-more:not(:disabled)');
      pending = undefined;
      if (loadMoreButton instanceof HTMLElement) loadMoreButton.focus();
      else host.focus({ preventScroll: true });
      return;
    }
    const range = host.querySelector('[data-page-range]');
    const text = range?.textContent.trim();
    if (!text || text === pending.range) return;
    // Some UI Kits render the new range before they finish the current request.
    if (getSearch()?.dataLayer.loading) {
      frame ??= requestAnimationFrame(() => {
        frame = undefined;
        restoreAfterRender();
      });
      return;
    }
    const button = host.querySelector(`button[data-page-step="${pending.step}"]:not(:disabled)`);
    pending = undefined;
    if (button) {
      button.focus();
      if (announcement) announcement.textContent = text;
    } else {
      range.focus();
    }
  }

  function leavePagination(event) {
    if (event.target === host && !pending?.loadMore) pending = undefined;
  }

  const observer = new MutationObserver(restoreAfterRender);
  observer.observe(host, { childList: true, characterData: true, subtree: true });
  // Capture load-more clicks before framework widget handlers stop
  // propagation, while paged controls continue through this helper.
  host.addEventListener('click', changePage, true);
  host.addEventListener('focusout', leavePagination);
  return () => {
    if (frame !== undefined) cancelAnimationFrame(frame);
    observer.disconnect();
    host.removeEventListener('click', changePage, true);
    host.removeEventListener('focusout', leavePagination);
  };
}

/** @param {{ paginationMode?: string, paginationPlacement?: string }} design @param {string} position */
export function showPaginationAt(design, position) {
  const placement = design.paginationMode === 'loadMore' ? 'below' : design.paginationPlacement || 'below';
  return placement === 'both' || placement === position;
}

/**
 * @param {HTMLElement} element
 * @returns {{ element: HTMLElement, range: HTMLElement, previous: HTMLButtonElement, next: HTMLButtonElement }}
 */
export function pageControls(element) {
  return {
    element,
    range: element.querySelector('[data-page-range]'),
    previous: element.querySelector('[data-page-step="previous"]'),
    next: element.querySelector('[data-page-step="next"]'),
  };
}

// The existing pager renders the page range and available actions. The upper
// copy uses the same search controller and restores focus within its own host.
export function setupPaginationPlacement(above, below, getDesign, getSearch) {
  const copy = above.querySelector('[data-page-copy]');
  const stopAbove = setupPaginationFocus(above, getSearch);
  const stopBelow = setupPaginationFocus(below, getSearch);
  let markup;

  function refresh() {
    const design = getDesign();
    const source = below.querySelector('nav:has([data-page-range])');
    const hiddenParent = source?.closest('[hidden]');
    const available = source && (!hiddenParent || hiddenParent === below || !below.contains(hiddenParent));
    const showAbove = showPaginationAt(design, 'above') && Boolean(available);
    const showBelow = showPaginationAt(design, 'below');
    source?.setAttribute('aria-label', showAbove && showBelow ? 'Search result pages below results' : 'Search result pages');
    const next = showAbove ? source.outerHTML : '';
    if (markup !== next) {
      markup = next;
      if (showAbove) {
        const nav = source.cloneNode(true);
        nav.setAttribute('aria-label', 'Search result pages above results');
        copy.replaceChildren(nav);
      } else copy.replaceChildren();
    }
    above.toggleAttribute('hidden', !showAbove);
    below.toggleAttribute('hidden', !showBelow);
    for (const pager of [above, below]) {
      pager.querySelector('[data-page-announcement]').setAttribute('aria-live', design.summaryMode === 'range' ? 'off' : 'polite');
    }
  }

  const observer = new MutationObserver(refresh);
  observer.observe(below, { childList: true, characterData: true, subtree: true, attributes: true,
    attributeFilter: ['hidden', 'disabled', 'data-page-start'] });
  refresh();
  return { refresh, destroy() { observer.disconnect(); stopAbove(); stopBelow(); } };
}
