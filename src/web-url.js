/** @param {string} value */
export function webURL(value) {
  try {
    const url = new URL(value);
    return (url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

/**
 * @param {string} value
 * @param {'emselect' | 'emsuggest' | 'related-search'} route
 */
export function readCustomerEndpoint(value, route = 'emselect') {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || !url.hostname.endsWith('.searchstax.com') ||
      url.port || url.username || url.password || url.search || url.hash ||
      !url.pathname.replace(/\/$/, '').endsWith('/' + route)) return null;
    return url.href;
  } catch {
    return null;
  }
}
