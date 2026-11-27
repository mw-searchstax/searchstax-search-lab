export type SearchCorrection = { original?: string; corrected: string };

type CorrectionResponse = {
  responseHeader?: {
    params?: Record<string, unknown>;
  };
};

export function readSearchCorrection(response: CorrectionResponse | SearchCorrection | null | undefined): SearchCorrection | null {
  if (response && 'original' in response && 'corrected' in response && typeof response.corrected === 'string') {
    const original = typeof response.original === 'string' ? response.original.trim() : '';
    return response.corrected && original !== response.corrected ? { original: original || undefined, corrected: response.corrected } : null;
  }
  const params = response && 'responseHeader' in response ? response.responseHeader?.params : undefined;
  const original = typeof params?.originalQ === 'string' ? params.originalQ.trim() : '';
  const corrected = typeof params?.autoCorrectedQ === 'string' ? params.autoCorrectedQ.trim() : '';
  if (!corrected || original === corrected) return null;
  return { original: original || undefined, corrected };
}

type CorrectionController = { render: (response: CorrectionResponse | SearchCorrection | null | undefined) => void; clear: () => void };
const hosts = new WeakMap<Document, CorrectionController>();

export function setupSearchCorrection(root: ParentNode, retryOriginal: (query: string) => void) {
  const host = root.querySelector<HTMLElement>('[data-search-correction]');
  const message = root.querySelector<HTMLElement>('[data-search-correction-message]');
  const retry = root.querySelector<HTMLButtonElement>('[data-search-correction-retry]');
  if (!host || !message || !retry) return { render: () => {}, clear: () => {} };
  let current: SearchCorrection | null = null;
  retry.addEventListener('click', () => {
    const correction = current;
    if (correction?.original) retryOriginal(correction.original);
  });
  const controller: CorrectionController = {
    render(response: CorrectionResponse | SearchCorrection | null | undefined) {
      const correction = readSearchCorrection(response);
      current = correction;
      host.hidden = !correction;
      if (!correction) {
        message.textContent = '';
        retry.textContent = '';
        retry.hidden = true;
        return;
      }
      message.textContent = `Showing results for “${correction.corrected}”.`;
      retry.hidden = !correction.original;
      retry.textContent = correction.original ? `Search original “${correction.original}”` : '';
    },
    clear() {
      current = null;
      host.hidden = true;
      message.textContent = '';
      retry.textContent = '';
      retry.hidden = true;
    },
  };
  hosts.set(host.ownerDocument, controller);
  return controller;
}

export function renderSearchCorrection(response: CorrectionResponse | null | undefined) {
  hosts.get(document)?.render(response);
}

type KitQuery = { query: string; page: number };

export function setupKitSpelling<Query extends KitQuery>(kit: {
  searchHelper: { generateQueryParams: (query: Query, forceOriginal?: boolean, facetType?: string) => string };
  dataLayer: { searchObject: Query; setSearchObject: (query: Query) => void };
  search: (query: Query) => void;
}, setting: () => boolean | null | undefined) {
  const helper = kit.searchHelper;
  const generate = helper.generateQueryParams.bind(helper);
  let original: string | null = null;
  helper.generateQueryParams = (query, forceOriginal, facetType) => {
    // The pinned kits always emit this parameter, even when no override was supplied.
    const parts = generate(query, forceOriginal, facetType).slice(1).split('&')
      .filter(part => !part.startsWith('spellcheck.correct='));
    const override = forceOriginal || original === query.query ? false : setting();
    if (typeof override === 'boolean') parts.push('spellcheck.correct=' + override);
    return '?' + parts.join('&');
  };
  return {
    clear() {
      const changed = original !== null;
      original = null;
      return changed;
    },
    rememberOriginal(term: string) { original = term; },
    retry(term: string) {
      original = term;
      const current = kit.dataLayer.searchObject;
      const next = { ...current, query: term, page: 1 };
      if (current.query === term && current.page === 1) kit.search(next);
      else kit.dataLayer.setSearchObject(next);
    },
  };
}

