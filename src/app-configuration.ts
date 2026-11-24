export type Profile = {
  language: string;
  profile: string;
  relatedSearches?: boolean;
  smartAnswers?: boolean;
  highlighting?: boolean;
};

export type Entitlements = Pick<Profile, 'relatedSearches' | 'smartAnswers'>;
export type AppConfiguration = { profiles: Profile[]; entitlements: Entitlements };

const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

function flag(value: unknown) {
  if (value == null) return undefined;
  if (typeof value !== 'boolean') throw Error('Use true, false, or null for each feature setting.');
  return value;
}

// Search Lab snapshot format. Only these nonsecret settings enter preview state.
export function readAppConfiguration(text: string, endpoint: string): AppConfiguration {
  let data: unknown;
  try { data = JSON.parse(text); } catch { throw Error('Choose a valid Search Lab configuration JSON file.'); }
  if (!record(data) || typeof data.endpoint !== 'string' ||
      data.endpoint.replace(/\/$/, '') !== endpoint.replace(/\/$/, '')) {
    throw Error('The snapshot’s Select endpoint must match the app you’re connecting to.');
  }
  if (!Array.isArray(data.profiles)) throw Error('The snapshot needs a profiles array from this app.');
  const seen = new Set<string>();
  const profiles = data.profiles.map((item: unknown) => {
    if (!record(item) || typeof item.profile !== 'string' || !item.profile.trim() ||
        typeof item.language !== 'string' || !/^[a-z][a-z0-9]*(?:[-_][a-z0-9]+)*$/i.test(item.language.trim())) {
      throw Error('Each snapshot profile needs a name and a language code.');
    }
    const profile = item.profile.trim();
    const language = item.language.trim().toLowerCase().replaceAll('-', '_');
    const key = JSON.stringify([language, profile]);
    if (seen.has(key)) throw Error('The snapshot lists the same language and profile twice.');
    seen.add(key);
    return { language, profile, relatedSearches: flag(item.relatedSearches),
      smartAnswers: flag(item.smartAnswers), highlighting: flag(item.highlighting) };
  });
  const languageFlags = data.relatedSearchesByLanguage;
  const settings = new Map<string, boolean | undefined>();
  if (languageFlags !== undefined) {
    if (!record(languageFlags)) throw Error('Use a language-to-setting object for Related Searches.');
    for (const [code, value] of Object.entries(languageFlags)) settings.set(code.toLowerCase().replaceAll('-', '_'), flag(value));
  } else {
    // Older snapshots stored the language setting on each profile. Conflicting values are unknown.
    for (const { language, relatedSearches } of profiles) {
      if (relatedSearches === undefined) continue;
      if (!settings.has(language)) settings.set(language, relatedSearches);
      else if (settings.get(language) !== relatedSearches) settings.set(language, undefined);
    }
  }
  for (const profile of profiles) profile.relatedSearches = settings.get(profile.language);
  const features = data.entitlements ?? {};
  if (!record(features)) throw Error('The snapshot’s entitlements must be an object.');
  return { profiles, entitlements: { relatedSearches: flag(features.relatedSearches), smartAnswers: flag(features.smartAnswers) } };
}

// Bind exported settings to the original app without including a customer's Select URL.
export async function endpointFingerprint(endpoint: string) {
  if (!globalThis.crypto?.subtle) return '';
  const bytes = new TextEncoder().encode(endpoint.trim().replace(/\/$/, ''));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

export function featureStatus(entitled?: boolean, configured?: boolean) {
  if (entitled === false) return 'Unavailable';
  if (configured === false) return 'Off';
  if (entitled === true && configured === true) return 'On';
  return 'Unknown';
}

export function profileStatus(entitlements: Entitlements, profile?: Partial<Profile>, highlight = profile?.highlighting, connection?: { relatedURL?: string; discoveryKey?: string; answerEndpoint?: string }) {
  const label = (value?: boolean) => value === undefined ? 'unknown' : value ? 'yes' : 'no';
  return (['relatedSearches', 'smartAnswers'] as const).map(key => {
    const name = key === 'relatedSearches' ? 'Related Searches' : 'Smart Answers';
    const status = featureStatus(entitlements[key], profile?.[key]);
    const configured = name + ' — ' + status + ' (entitled: ' + label(entitlements[key]) + ', configured: ' + label(profile?.[key]) + ').';
    if (status === 'On' && connection) {
      if (key === 'relatedSearches' && (!connection.relatedURL || !connection.discoveryKey)) return configured + ' Add the Related Searches endpoint and Discovery key to preview it.';
      if (key === 'smartAnswers' && !connection.answerEndpoint) return configured + ' Add the Answer endpoint to preview it.';
    }
    return configured;
  }).concat('Hit highlighting — ' + (highlight === undefined ? 'Unknown' : highlight ? 'On' : 'Off') + '.').join(' ');
}
