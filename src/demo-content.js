// Search Lab’s demo index can still contain records from before the site rename.
export function demoResultText(value) {
  return typeof value === 'string' ? value.replaceAll('Alder Coast', 'Central County') : '';
}

export function demoResultTitle(value) {
  return demoResultText(value)
    .replace(/<\/?(?:em|b|strong)>/gi, '')
    .replace(/\s*\|\s*Central County University Health\s*$/, '');
}
