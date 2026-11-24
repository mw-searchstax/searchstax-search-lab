const sampleTerms = [
  'campus flu clinic',
  'international health',
  'orthopedics',
  'primary care',
  'rehabilitation',
  'rehabilitation center',
  'sports medicine',
  'travel vaccinations',
];

export const sampleSuggestionSource = {
  label: 'Sample search suggestions',
  minimumChars: 3,
  suggest(prefix) {
    const normalized = prefix.toLowerCase();
    return sampleTerms.filter(term => term !== normalized && term.startsWith(normalized));
  },
};

export function setupSearchSuggestions(form, listId) {
  const input = form.querySelector('input[type="search"]');
  const popup = document.createElement('div');
  const label = document.createElement('p');
  const list = document.createElement('ul');
  const feedback = document.createElement('p');
  feedback.className = 'search-suggestions-feedback';
  feedback.setAttribute('role', 'status');
  popup.className = 'sample-search-suggestions';
  popup.hidden = true;
  label.id = listId + '-label';
  list.id = listId;
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-labelledby', label.id);
  popup.append(label, list);
  form.after(popup, feedback);

  let source = null;
  let pending = null;
  let activeIndex = -1;

  function close() {
    if (pending) {
      window.clearTimeout(pending.timer);
      pending.controller.abort();
      pending = null;
    }
    popup.hidden = true;
    list.replaceChildren();
    feedback.textContent = '';
    activeIndex = -1;
    input.removeAttribute('aria-activedescendant');
    if (source) input.setAttribute('aria-expanded', 'false');
  }

  function show(matches) {
    if (!matches.length) return;
    list.replaceChildren(...matches.map((term, index) => {
      const option = document.createElement('li');
      option.id = listId + '-' + index;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      if (source.language) option.lang = source.language;
      option.textContent = term;
      return option;
    }));
    popup.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  function requestSuggestions() {
    close();
    const prefix = input.value.trim();
    const activeSource = source;
    if (!activeSource || prefix.length < activeSource.minimumChars) return;
    const request = { controller: new AbortController(), step: 0, timer: undefined };
    pending = request;
    const resolve = async () => {
      try {
        const matches = await activeSource.suggest(prefix, request.controller.signal);
        if (pending !== request || input.value.trim() !== prefix) return;
        show(matches);
        if (!popup.hidden && request.step) moveSelection(request.step);
      } catch {
        if (pending === request) feedback.textContent = 'Search suggestions are unavailable. You can continue searching.';
      } finally {
        if (pending === request) pending = null;
      }
    };
    if (activeSource.delay) request.timer = window.setTimeout(resolve, activeSource.delay);
    else void resolve();
  }

  function choose(option) {
    input.value = option.textContent;
    close();
    input.focus({ preventScroll: true });
    form.requestSubmit();
  }

  function moveSelection(step) {
    if (popup.hidden) {
      if (!pending) requestSuggestions();
      if (!pending) return false;
      pending.step = step;
      return true;
    }
    const options = list.children;
    if (activeIndex >= 0) options[activeIndex].setAttribute('aria-selected', 'false');
    if (activeIndex === -1) activeIndex = step > 0 ? 0 : options.length - 1;
    else activeIndex = (activeIndex + step + options.length) % options.length;
    const option = options[activeIndex];
    option.setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', option.id);
    option.scrollIntoView({ block: 'nearest' });
    return true;
  }

  input.addEventListener('input', event => {
    if (event.isComposing) close();
    else requestSuggestions();
  });
  input.addEventListener('compositionend', requestSuggestions);
  input.addEventListener('blur', close);
  input.addEventListener('keydown', event => {
    if (!source || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        if (moveSelection(event.key === 'ArrowDown' ? 1 : -1)) event.preventDefault();
        break;
      case 'Escape':
        if (popup.hidden && !pending) break;
        event.preventDefault();
        close();
        break;
      case 'Enter':
        if (activeIndex < 0) break;
        event.preventDefault();
        choose(list.children[activeIndex]);
        break;
    }
  });
  form.addEventListener('submit', close);
  list.addEventListener('mousedown', event => event.preventDefault());
  list.addEventListener('click', event => {
    const option = event.target.closest('[role="option"]');
    if (option) choose(option);
  });

  return function setSuggestionSource(value) {
    if (source === value) return;
    source = value;
    close();
    if (source) {
      label.textContent = source.label;
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-autocomplete', 'list');
      input.setAttribute('aria-controls', listId);
    } else {
      for (const attribute of ['role', 'aria-autocomplete', 'aria-controls', 'aria-expanded']) {
        input.removeAttribute(attribute);
      }
    }
  };
}
