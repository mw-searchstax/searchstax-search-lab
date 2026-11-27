import { readCustomerEndpoint } from './web-url.js';

export function relatedSource(endpoint, key, language) {
  const url = readCustomerEndpoint(endpoint || '', 'related-search');
  if (!url || !key?.trim()) return null;
  return async (query, signal) => {
    const request = new URL(url);
    request.search = new URLSearchParams({ search: query });
    if (language) request.searchParams.set('language', language);
    const response = await fetch(request, {
      signal, headers: { Authorization: key.trim(), Accept: 'application/json' },
      credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error',
    });
    if (!response.ok) throw new Error('Discovery request failed');
    const data = await response.json();
    if (data.success === false || !Array.isArray(data.response?.docs)) throw new Error('Discovery unavailable');
    return data.response.docs.map(doc => doc?.related_search).filter(term => typeof term === 'string' && term.trim());
  };
}

export function setupRelatedSearches(form, selectTerm) {
  const section = document.createElement('section');
  section.className = 'search-related-terms';
  section.setAttribute('aria-label', 'Related searches');
  const heading = document.createElement('strong');
  heading.textContent = 'Related searches';
  const options = document.createElement('div');
  section.append(heading, options);
  let controller;
  let currentQuery;
  let currentSource;

  function clear() {
    controller?.abort();
    controller = undefined;
    currentSource = undefined;
    currentQuery = undefined;
    section.remove();
    options.replaceChildren();
  }

  async function show(anchor, placement, query, source) {
    if (!anchor || !source || !query || placement === 'off') { clear(); return; }
    function move() {
      // Keep the typeahead list attached to its input when both features are visible.
      const searchBoxEnd = form.parentElement.querySelector(':scope > .search-suggestions-feedback') || form;
      const preceding = placement === 'above' ? searchBoxEnd : anchor;
      if (preceding.nextElementSibling !== section) preceding.after(section);
    }
    if (currentQuery === query && currentSource === source) {
      move();
      return;
    }
    clear();
    currentQuery = query;
    currentSource = source;
    section.hidden = true;
    move();
    const pending = new AbortController();
    controller = pending;
    try {
      const terms = await source(query, pending.signal);
      if (pending.signal.aborted) return;
      for (const term of new Set(terms)) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = term;
        button.addEventListener('click', () => selectTerm(term));
        options.append(button);
      }
      section.hidden = !options.childElementCount;
    } catch {
      if (!pending.signal.aborted) {
        options.textContent = 'Related searches are unavailable for this query. Check the Discovery settings for your app.';
        section.hidden = false;
        currentQuery = undefined;
      }
    }
  }
  return {
    show,
    clear,
    setAppearance(design, defaultHeading = 'Related searches') {
      const label = design.relatedHeading?.trim() || defaultHeading;
      if (heading.textContent !== label) {
        heading.textContent = label;
        section.setAttribute('aria-label', label);
      }
      section.classList.toggle('search-related-terms--chips', design.relatedItemStyle === 'chips');
      section.classList.toggle('search-related-terms--compact', design.relatedSpacing === 'compact');
    },
  };
}
