/** Shared, browser-safe location request and response helpers.
 *
 * SearchStax's location widget calls a customer supplied `locationDecode`
 * hook. The Lab keeps that hook outside saved design state: a place string is
 * decoded for the current search, while only the selected radius is persisted.
 */

export type LocationSelection = {
  address: string;
  lat: string;
  lon: string;
  radius: string;
};

export type LocationSupport = {
  enabled: boolean;
  distanceEnabled: boolean;
  filterValues: string[];
  unit: string;
  defaultValue: string;
};

const numberText = (value: unknown) => typeof value === 'number' && Number.isFinite(value)
  ? String(value) : typeof value === 'string' && /^-?\d+(?:\.\d+)?$/.test(value.trim()) ? value.trim() : '';

export function readLocationSupport(metadata: unknown): LocationSupport | undefined {
  if (!metadata || typeof metadata !== 'object') return undefined;
  const record = metadata as Record<string, unknown>;
  const locationValue = record.locationSearch ?? record.location;
  const location = locationValue && typeof locationValue === 'object' ? locationValue as Record<string, unknown> : undefined;
  if (!location) return undefined;
  const filter = location.filter && typeof location.filter === 'object' ? location.filter as Record<string, unknown> : undefined;
  const values = (Array.isArray(filter?.values) ? filter?.values : Array.isArray(location.filterValues) ? location.filterValues : [])
    .map(value => value === 'any' ? value : numberText(value)).filter(value => value === 'any' || Number(value) > 0);
  const enabled = location.enabled === true;
  const distanceEnabled = enabled && filter?.enabled === true;
  if (!enabled) return undefined;
  const unit = typeof location.unit === 'string' && location.unit.trim()
    ? location.unit.trim() : typeof filter?.unit === 'string' && filter.unit.trim() ? filter.unit.trim() : '';
  const filterValues = [...new Set(values.length ? values : ['any'])];
  if (!distanceEnabled) return { enabled: true, distanceEnabled: false, filterValues: ['any'], unit, defaultValue: 'any' };
  const requestedDefault = filter?.defaultValue === 'any' ? 'any' : numberText(filter?.defaultValue);
  const defaultValue = requestedDefault && filterValues.includes(requestedDefault) ? requestedDefault : filterValues[0] || 'any';
  return { enabled: true, distanceEnabled, filterValues, unit, defaultValue };
}

export function locationRadius(value: unknown, support?: LocationSupport): string {
  const text = typeof value === 'string' ? value.trim() : numberText(value);
  if (!text) return support?.defaultValue || 'any';
  return support?.filterValues.includes(text) ? text : support?.defaultValue || 'any';
}

export function locationQuery(selection?: LocationSelection): Record<string, string> {
  if (!selection || !selection.lat || !selection.lon) return {};
  const lat = Number(selection.lat);
  const lon = Number(selection.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) return {};
  const query: Record<string, string> = { pt: lat.toFixed(6) + ',' + lon.toFixed(6) };
  if (selection.radius && selection.radius !== 'any') query.distanceFilter = selection.radius;
  return query;
}

export function locationLabel(value: string, unit: string): string {
  return value === 'any' ? 'Any distance' : [value, unit].filter(Boolean).join(' ');
}


type DecodedPlace = { address?: string; lat?: string | number; lon?: string | number };
type Geocoder = (place: string) => Promise<DecodedPlace | null>;

export async function decodeBrowserLocation(place: string) {
  const decode = (globalThis as typeof globalThis & { SearchLabLocationGeocoder?: Geocoder }).SearchLabLocationGeocoder;
  if (typeof decode !== 'function') return null;
  const match = await decode(place);
  if (match?.lat == null || match.lon == null) return null;
  const location = { address: match.address?.trim() || place, lat: numberText(match.lat), lon: numberText(match.lon) };
  return locationQuery({ ...location, radius: 'any' }).pt ? location : null;
}

type KitSearch = { query: string; page: number; additionalProps?: { key: string; value: string }[] };

export function searchWithLocation<T extends KitSearch>(
  kit: { dataLayer: { searchObject: T; setSearchObject(search: T): void } } | null | undefined,
  selection?: LocationSelection,
) {
  const current = kit?.dataLayer.searchObject;
  if (!current?.query) return;
  const additionalProps = (current.additionalProps ?? [])
    .filter(({ key }) => key !== 'pt' && key !== 'distanceFilter');
  for (const [key, value] of Object.entries(locationQuery(selection))) additionalProps.push({ key, value });
  kit?.dataLayer.setSearchObject({ ...current, page: 1, additionalProps });
}

export function setupStarterLocation(
  savedRadius: string | null,
  search: (location?: LocationSelection) => void,
) {
  let support: LocationSupport | undefined;
  let location: LocationSelection | undefined;
  let render: ((value: LocationSupport | undefined) => void) | undefined;

  function attach(panel: HTMLElement) {
    panel.innerHTML = `<label for="search-location-input">Search near</label>
      <input id="search-location-input" type="text" autocomplete="off" placeholder="Enter a place">
      <button type="button" class="search-starter__submit" data-location-apply>Apply location</button>
      <label for="search-location-radius">Radius</label>
      <select id="search-location-radius"></select>
      <button type="button" class="search-starter__submit" data-location-clear hidden>Clear location</button>
      <p role="status"></p>`;
    const input = panel.querySelector<HTMLInputElement>('input')!;
    const radius = panel.querySelector<HTMLSelectElement>('select')!;
    const label = panel.querySelector<HTMLLabelElement>('label[for="search-location-radius"]')!;
    const apply = panel.querySelector<HTMLButtonElement>('[data-location-apply]')!;
    const clear = panel.querySelector<HTMLButtonElement>('[data-location-clear]')!;
    const status = panel.querySelector<HTMLElement>('[role="status"]')!;
    let revision = 0;
    let selectedRadius = '';
    let options = '';

    async function submit() {
      const place = input.value.trim();
      if (!place || !support || apply.disabled) return;
      const current = ++revision;
      apply.disabled = true;
      status.textContent = 'Finding that place…';
      try {
        const decoded = await decodeBrowserLocation(place);
        if (current !== revision || !support) return;
        if (!decoded) {
          status.textContent = 'That place couldn’t be found. Check the place or the site’s geocoder.';
          return;
        }
        location = { ...decoded, radius: locationRadius(selectedRadius, support) };
        clear.hidden = false;
        status.textContent = '';
        search(location);
      } catch {
        if (current === revision) status.textContent = 'Location search couldn’t find that place. Try again.';
      } finally {
        if (current === revision) apply.disabled = false;
      }
    }

    apply.addEventListener('click', () => void submit());
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') { event.preventDefault(); void submit(); }
    });
    radius.addEventListener('change', () => {
      selectedRadius = radius.value;
      if (!location) return;
      location = { ...location, radius: selectedRadius };
      search(location);
    });
    clear.addEventListener('click', () => {
      revision++;
      location = undefined;
      apply.disabled = false;
      input.value = '';
      status.textContent = '';
      clear.hidden = true;
      input.focus();
      search();
    });

    return (next?: LocationSupport) => {
      panel.hidden = !next;
      if (!next) {
        revision++;
        location = undefined;
        selectedRadius = '';
        options = '';
        status.textContent = '';
        apply.disabled = false;
        input.value = '';
        clear.hidden = true;
        return;
      }
      label.hidden = radius.hidden = !next.distanceEnabled;
      const optionKey = JSON.stringify([next.unit, next.filterValues]);
      if (optionKey !== options) {
        options = optionKey;
        radius.replaceChildren(...next.filterValues.map(value => new Option(locationLabel(value, next.unit), value)));
      }
      selectedRadius = locationRadius(selectedRadius || savedRadius, next);
      radius.value = selectedRadius;
    };
  }

  return (metadata: unknown) => {
    support = readLocationSupport(metadata);
    if (!render && support) {
      const panel = document.getElementById('search-location');
      if (panel) render = attach(panel);
    }
    render?.(support);
  };
}
