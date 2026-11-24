/** Inline feedback belongs to the control that requested the search, including a pager. */
export function createSearchRecovery(defaultControl: HTMLElement, repeat: () => void) {
  const group = document.createElement('div');
  group.className = 'search-recovery';
  group.hidden = true;
  const message = document.createElement('p');
  message.className = 'search-lab__feedback';
  message.dataset.tone = 'error';
  message.id = 'search-error-' + ++nextId;
  message.setAttribute('role', 'status');
  message.tabIndex = -1;
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.className = 'lt-btn lt-btn--secondary';
  retry.setAttribute('aria-describedby', message.id);
  group.append(message, retry);
  let anchor: HTMLElement;
  let control: HTMLElement;
  let pending = false;
  let focusAtStart: Element | null;

  function clear() {
    if (group.contains(document.activeElement)) {
      const target = control?.isConnected && control.getClientRects().length && !control.matches(':disabled')
        ? control : defaultControl;
      target.focus({ preventScroll: true });
    }
    group.hidden = true;
    message.textContent = '';
    pending = false;
  }

  retry.addEventListener('click', () => {
    if (!pending) repeat();
  });

  return {
    begin(place: HTMLElement, trigger: HTMLElement = defaultControl) {
      if (place !== anchor || document.activeElement !== retry) clear();
      else message.textContent = '';
      anchor = place;
      control = trigger;
      pending = true;
      focusAtStart = document.activeElement;
      retry.setAttribute('aria-disabled', 'true');
    },
    error(text: string, label = 'Retry search') {
      pending = false;
      retry.removeAttribute('aria-disabled');
      retry.textContent = label;
      if (!anchor.isConnected) anchor = defaultControl.closest('form') || defaultControl;
      if (anchor.nextElementSibling !== group) anchor.after(group);
      group.hidden = false;
      message.textContent = text;
      // If the learner has moved on during the request, leave their position alone.
      requestAnimationFrame(() => {
        if (group.hidden || pending || !anchor.getClientRects().length) return;
        const area = anchor.getBoundingClientRect();
        const bounds = group.getBoundingClientRect();
        const focus = document.activeElement;
        const stillAtControl = focus === focusAtStart || anchor.contains(focus) || group.contains(focus);
        if (stillAtControl && area.bottom >= 0 && area.top < innerHeight &&
            (bounds.top < 8 || bounds.bottom > innerHeight - 8)) {
          group.scrollIntoView({ block: 'center', behavior: 'instant' });
        }
      });
    },
    clear,
  };
}

let nextId = 0;
