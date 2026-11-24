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
    const api = getSearch();
    const current = api?.dataLayer.searchObject;
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
    if (!pending || document.activeElement !== host) return;
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
    if (event.target === host) pending = undefined;
  }

  const observer = new MutationObserver(restoreAfterRender);
  observer.observe(host, { childList: true, characterData: true, subtree: true });
  host.addEventListener('click', changePage);
  host.addEventListener('focusout', leavePagination);
  return () => {
    if (frame !== undefined) cancelAnimationFrame(frame);
    observer.disconnect();
    host.removeEventListener('click', changePage);
    host.removeEventListener('focusout', leavePagination);
  };
}
