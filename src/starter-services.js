import { endpointFingerprint, featureStatus } from './app-configuration.js';
import { relatedSource, setupRelatedSearches } from './related-searches.js';
import { setupStarterAnswers } from './starter-answers.js';
import { featureSettings } from './feature-settings.js';

async function matchesApp(endpoint) {
  if (!endpoint) return false;
  const normalized = endpoint.trim().replace(/\/$/, '');
  if (featureSettings.endpoint) return normalized === featureSettings.endpoint.replace(/\/$/, '');
  return !!featureSettings.endpointHash && await endpointFingerprint(normalized) === featureSettings.endpointHash;
}

// Ordinary starters have one connection. Each submitted search supersedes pending work.
export function setupStarterServices(form, answerHost, connection, design) {
  const language = connection.language.trim().replaceAll('-', '_').toLowerCase();
  const profile = featureSettings.profiles?.find(item => item.language === language && item.profile === connection.model);
  const entitled = featureSettings.entitlements;
  const relatedOn = featureStatus(entitled?.relatedSearches, featureSettings.relatedSearchesByLanguage?.[language]) === 'On';
  const answersOn = featureStatus(entitled?.smartAnswers, profile?.smartAnswers) === 'On';
  const source = relatedOn ? relatedSource(connection.relatedURL, connection.discoveryKey, connection.language) : null;
  const answerReady = answersOn && connection.searchAuth.trim() && connection.questionURL.trim();
  const appMatches = (source || answerReady) && matchesApp(connection.searchURL).catch(() => false);
  const anchor = form.closest('.search-starter').querySelector('.search-starter__body');
  const related = setupRelatedSearches(form, term => {
    form.querySelector('input[type="search"]').value = term;
    form.requestSubmit();
  });
  related.setAppearance(design);
  let answers;
  let revision = 0;
  return {
    async search(query) {
      const current = ++revision;
      if (!appMatches || !await appMatches || current !== revision) return;
      void related.show(anchor, design.relatedPlacement === 'above' ? 'above' : 'below', query, source);
      if (answerReady) {
        answers ??= setupStarterAnswers(answerHost, connection, design);
        answers?.start(query);
      }
    },
    clear() {
      revision++;
      related.clear();
      answers?.clear();
    },
  };
}
