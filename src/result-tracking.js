export function getAnalyticsSettings(connection) {
  const analyticsBaseUrl = connection.analyticsBaseUrl?.trim().replace(/\/+$/, '');
  const trackApiKey = connection.trackApiKey?.trim();
  return analyticsBaseUrl && trackApiKey
    ? { analyticsBaseUrl, trackApiKey }
    : { analyticsBaseUrl: '', trackApiKey: '' };
}

export function setupResultTracking(host, search) {
  if (!search.dataLayer.searchstaxConfig?.trackApiKey) return;

  // Enter dispatches a click on an anchor. A middle click dispatches auxclick.
  host.addEventListener('click', trackResultClick);
  host.addEventListener('auxclick', trackResultClick);
  return () => {
    host.removeEventListener('click', trackResultClick);
    host.removeEventListener('auxclick', trackResultClick);
  };

  function trackResultClick(event) {
    const link = event.target.closest('a[data-result-id]');
    const layer = search.dataLayer;
    if (!link || event.defaultPrevented || layer.cookiesDisabled ||
        event.button !== (event.type === 'auxclick' ? 1 : 0)) return;

    const result = layer.searchResults?.find(item => item.uniqueId === link.dataset.resultId);
    const tracking = layer.parsedData.trackingData;
    const queue = window._msq;
    if (!result || !tracking.session || !queue) return;
    const command = ['trackClick', {
      key: tracking.trackApiKey, query: tracking.searchTerm, model: tracking.model,
      session: tracking.session, language: tracking.language, pageNo: tracking.currentPage,
      shownHits: tracking.recordsPerPage, totalHits: tracking.totalResults, latency: tracking.latencyVal,
      cDocId: result.uniqueId, cDocTitle: result.titleTracking, position: result.position,
    }];
    if (event.button === 1 || event.ctrlKey || event.metaKey || event.shiftKey ||
        event.altKey || (link.target && link.target !== '_self')) {
      queue.push(command);
      return;
    }

    event.preventDefault();
    // Give the tracker time to send the click, even when its script is still loading.
    // A blocked script or a stalled request must still let the visitor open the link.
    let timer = window.setTimeout(openResult, 1500);
    function openResult() {
      if (timer === undefined) return;
      window.clearTimeout(timer);
      timer = undefined;
      window.location.assign(link.href);
    }
    if (Array.isArray(queue)) queue.push(command);
    else queue.push(command, openResult);
  }
}
