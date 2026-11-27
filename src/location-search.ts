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

async function decodeBrowserLocation(place: string): Promise<DecodedPlace | null> {
  const decode = (globalThis as typeof globalThis & { SearchLabLocationGeocoder?: Geocoder }).SearchLabLocationGeocoder;
  if (typeof decode !== 'function') return null;
  const match = await decode(place);
  if (match?.lat == null || match.lon == null) return null;
  return { address: match.address?.trim() || place, lat: match.lat, lon: match.lon };
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

type LocationControls = {
  defaultRadius: () => string | null;
  allowCurrent: () => boolean;
  search: (selection: LocationSelection | undefined, anchor: HTMLElement, control: HTMLElement) => void;
  saveRadius?: (radius: string) => void;
  idleMessage?: string;
};

async function readCurrentPosition() {
  const { coords } = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
  });
  return { address: 'your current location', lat: coords.latitude, lon: coords.longitude };
}

function currentPositionError(error: unknown) {
  if (typeof error === 'object' && error && 'code' in error && error.code === 1) {
    return 'Location permission was denied. Enter a place to search nearby.';
  }
  return 'Your current location is unavailable. Enter a place to search nearby.';
}

export function setupLocationControls(panel: HTMLElement, options: LocationControls) {
  const input = panel.querySelector<HTMLInputElement>('input')!;
  const radius = panel.querySelector<HTMLSelectElement>('select')!;
  const apply = panel.querySelector<HTMLButtonElement>('[data-location-apply]')!;
  const current = panel.querySelector<HTMLButtonElement>('[data-location-current]')!;
  const clear = panel.querySelector<HTMLButtonElement>('[data-location-clear]')!;
  const status = panel.querySelector<HTMLElement>('[role="status"]')!;
  let support: LocationSupport | undefined;
  let selection: LocationSelection | undefined;
  let selectedRadius = '';
  let renderedRadiusOptions = '';
  let revision = 0;
  let pending: HTMLButtonElement | undefined;

  function cancelLookup() {
    revision++;
    pending?.removeAttribute('aria-disabled');
    pending = undefined;
  }

  function showSelection() {
    clear.hidden = !selection;
    status.textContent = selection
      ? 'Searching near ' + selection.address + (selection.radius === 'any' ? '.' :
        ' within ' + locationLabel(selection.radius, support?.unit ?? '') + '.')
      : options.idleMessage ?? '';
  }

  function refreshCurrentLocation() {
    current.hidden = !(support?.enabled && options.allowCurrent() && window.isSecureContext && navigator.geolocation);
    if (current.hidden && pending === current) {
      cancelLookup();
      showSelection();
    }
  }

  async function lookup(through: HTMLButtonElement, read: () => Promise<DecodedPlace | null>) {
    if (!support?.enabled || pending === through || through.closest('[hidden]')) return;
    cancelLookup();
    const request = revision;
    const device = through === current;
    pending = through;
    through.setAttribute('aria-disabled', 'true');
    status.textContent = device ? 'Finding your current location…' : 'Finding that place…';
    try {
      const place = await read();
      if (request !== revision || through.closest('[hidden]')) return;
      const chosenRadius = locationRadius(radius.value, support);
      const next = place && {
        address: place.address ?? input.value.trim(),
        lat: numberText(place.lat),
        lon: numberText(place.lon),
        radius: chosenRadius,
      };
      if (!next || !locationQuery(next).pt) {
        status.textContent = device ? currentPositionError(null) :
          'That place couldn’t be found. Check the place or the configured geocoder.';
        return;
      }
      selection = next;
      if (device) input.value = '';
      showSelection();
      options.search(selection, through, device ? current : input);
    } catch (error) {
      if (request !== revision || through.closest('[hidden]')) return;
      status.textContent = device ? currentPositionError(error) :
        'The place could not be decoded. Check the configured browser geocoder.';
    } finally {
      if (request === revision) cancelLookup();
    }
  }

  function submitPlace() {
    const place = input.value.trim();
    if (place) void lookup(apply, () => decodeBrowserLocation(place));
  }

  apply.addEventListener('click', submitPlace);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') { event.preventDefault(); submitPlace(); }
  });
  input.addEventListener('input', () => {
    if (!pending) return;
    cancelLookup();
    showSelection();
  });
  current.addEventListener('click', () => { void lookup(current, readCurrentPosition); });
  radius.addEventListener('change', () => {
    selectedRadius = locationRadius(radius.value, support);
    options.saveRadius?.(selectedRadius);
    if (!selection) return;
    selection = { ...selection, radius: selectedRadius };
    if (!pending) showSelection();
    options.search(selection, radius, radius);
  });
  clear.addEventListener('click', () => {
    cancelLookup();
    selection = undefined;
    input.value = '';
    showSelection();
    input.focus();
    options.search(undefined, clear, input);
  });

  return {
    get selection() { return selection; },
    refreshCurrentLocation,
    render(next?: LocationSupport) {
      support = next;
      panel.hidden = !next?.enabled;
      if (!next?.enabled) {
        cancelLookup();
        selection = undefined;
        selectedRadius = '';
        input.value = '';
        status.textContent = '';
        clear.hidden = true;
        refreshCurrentLocation();
        return;
      }
      radius.hidden = !next.distanceEnabled;
      radius.labels?.forEach(label => { label.hidden = !next.distanceEnabled; });
      const optionsKey = JSON.stringify([next.unit, next.filterValues]);
      if (optionsKey !== renderedRadiusOptions) {
        renderedRadiusOptions = optionsKey;
        radius.replaceChildren(...next.filterValues.map(value => new Option(locationLabel(value, next.unit), value)));
      }
      radius.value = locationRadius(selection?.radius || selectedRadius || options.defaultRadius(), next);
      refreshCurrentLocation();
      if (!pending) showSelection();
    },
  };
}

export function setupStarterLocation(
  savedRadius: string | null,
  showCurrentLocation: boolean,
  search: (location?: LocationSelection) => void,
) {
  let controls: ReturnType<typeof setupLocationControls> | undefined;

  return (metadata: unknown) => {
    const support = readLocationSupport(metadata);
    if (!controls && support) {
      const panel = document.getElementById('search-location');
      if (panel) {
        panel.innerHTML = `<label for="search-location-input">Search near</label>
          <input id="search-location-input" type="text" autocomplete="off" placeholder="Enter a place">
          <button type="button" class="search-starter__submit" data-location-apply>Apply location</button>
          <button type="button" class="search-starter__submit" data-location-current hidden>Use my location</button>
          <label for="search-location-radius">Radius</label>
          <select id="search-location-radius"></select>
          <button type="button" class="search-starter__submit" data-location-clear hidden>Clear location</button>
          <p role="status"></p>`;
        controls = setupLocationControls(panel, {
          defaultRadius: () => savedRadius,
          allowCurrent: () => showCurrentLocation,
          search,
        });
      }
    }
    controls?.render(support);
  };
}
