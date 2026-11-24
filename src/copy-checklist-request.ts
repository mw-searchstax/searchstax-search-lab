export async function tryCopyText(value: string): Promise<boolean> {
  try {
    if (!navigator.clipboard) return false;
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function setupRequestCopy(
  copyButton: HTMLButtonElement,
  copyStatus: HTMLElement,
  request: HTMLTextAreaElement,
  messages: { copied: string; manual: string },
) {
  copyButton.addEventListener('click', async () => {
    const draft = request.value;
    const copied = await tryCopyText(draft);

    if (request.value !== draft) return;
    request.hidden = copied;
    copyStatus.textContent = copied ? messages.copied : messages.manual;
    if (!copied) {
      request.focus();
      request.select();
    }
  });
}
