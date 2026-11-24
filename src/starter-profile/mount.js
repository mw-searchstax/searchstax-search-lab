import { setupExperiencePreview } from './profile-experiences.js';
import { readAnswerEndpoint } from './customer-answers.js';
import { readCustomerEndpoint } from './web-url.js';
import { settings, connection } from './config.js';

export function mountProfileSearch(host) {
  const main = document.createElement('main');
  main.className = 'search-starter';
  if (settings.logoURL) {
    const logo = document.createElement('img');
    logo.className = 'search-starter__logo';
    logo.alt = 'Company logo';
    logo.referrerPolicy = 'no-referrer';
    logo.src = settings.logoURL;
    main.append(logo);
  }
  const heading = document.createElement('h1');
  const live = settings.source === 'app';
  heading.textContent = live ? 'Search your site' : 'Search Central County';
  const panel = document.createElement('section');
  panel.className = 'lab-experiences';
  panel.setAttribute('aria-label', 'Search by language and profile');
  panel.innerHTML = %%EXPERIENCE_HTML%%;
  main.append(heading, panel);
  host.replaceChildren(main);

  const search = setupExperiencePreview(panel, settings.thumbnails);
  panel.hidden = true;
  search.configure(settings.navigation);
  const app = live ? {
    endpoint: readCustomerEndpoint(connection.endpoint) || '',
    token: connection.token.trim(),
    configuration: { entitlements: settings.entitlements ?? {}, profiles: settings.profiles },
    answerEndpoint: readAnswerEndpoint(connection.answerEndpoint || ''),
    suggestEndpoint: readCustomerEndpoint(connection.suggestEndpoint || '', 'emsuggest'),
    relatedURL: readCustomerEndpoint(connection.relatedURL || '', 'related-search'),
    discoveryKey: connection.discoveryKey || '',
  } : null;
  search.setSource(app, settings.profiles, settings.initialQuery, settings.selected, settings.defaultLanguage);
  panel.hidden = false;
  search.open();
  return () => { search.close(); host.replaceChildren(); };
}
