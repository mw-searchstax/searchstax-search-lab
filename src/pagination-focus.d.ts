export function showPaginationAt(
  design: { paginationMode?: string; paginationPlacement?: string },
  position: string,
): boolean;

export function pageControls(element: HTMLElement): {
  element: HTMLElement;
  range: HTMLElement;
  previous: HTMLButtonElement;
  next: HTMLButtonElement;
};
