export const lessonStartEvent = 'lab:lesson-start';

export function setupLessonProgress(
  section: HTMLElement,
  toggle: HTMLInputElement,
  next: HTMLElement,
  renderBaseline?: () => void,
) {
  toggle.addEventListener('change', () => {
    if (toggle.checked) next.hidden = false;
  });

  section.addEventListener(lessonStartEvent, () => {
    toggle.checked = false;
    next.hidden = true;
    for (const details of next.querySelectorAll('details[open]')) details.removeAttribute('open');
    renderBaseline?.();
  });
}
