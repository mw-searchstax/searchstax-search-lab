import { setupSearchSuggestions, sampleSuggestionSource } from './sample-suggestions.js';
import { createCustomerSuggestionSource } from './customer-suggestions.js';
import { setupRelatedSearches, relatedSource, demoRelatedSource } from './related-searches.js';
import { featureStatus } from './app-configuration.js';
import { setupCustomerAnswers } from './customer-answers.js';
import { createSampleExternalPromotion, updateSampleExternalPromotion, samplePromotionMode, samplePromotionQuery, applySampleIndexedPromotion } from './sample-promotions.js';

const spanishTerms = ['campus norte', 'campus sur', 'clínica del campus norte', 'clínica del campus sur', 'rehabilitación', 'salud pública', 'simulación de enfermería'];
const spanishSuggestions = {
  label: 'Sugerencias de búsqueda', language: 'es', minimumChars: 3,
  suggest(prefix) {
    const term = prefix.toLocaleLowerCase('es');
    return spanishTerms.filter(value => value !== term && value.startsWith(term));
  },
};
const directoryRelated = {
  en: { campus: ['campus clinic', 'public health'], 'campus clinic': ['campus', 'rehabilitation'] },
  es: { campus: ['campus norte', 'campus sur'], rehabilitación: ['terapia física'], clínica: ['campus norte', 'campus sur'] },
};
const relatedEnglish = query => directoryRelated.en[query.toLowerCase()] ?? demoRelatedSource(query);
const relatedSpanish = query => directoryRelated.es[query.toLowerCase()] ?? [];

export const spanishPromotionQuery = 'clínica de gripe del campus';

function promotionMode(query, setting) {
  return samplePromotionMode(query.trim().toLowerCase() === spanishPromotionQuery ? samplePromotionQuery : query, setting);
}

export function orderDirectoryResults(items, sort, query, setting) {
  if (sort) {
    const direction = sort === 'url desc' ? -1 : 1;
    return items.sort((a, b) => direction * a.url.localeCompare(b.url));
  }
  const ranked = applySampleIndexedPromotion(items, { response: { start: 0 } }, promotionMode(query, setting));
  return ranked.map(item => ({ ...item, promoted: Boolean(item.sampleIndexedPromotion) }));
}

export function setupProfileFeatures(panel, submit) {
  const form = panel.querySelector('form');
  const setSuggestions = setupSearchSuggestions(form, 'profile-search-suggestions');
  const related = setupRelatedSearches(form, term => { form.querySelector('input').focus(); submit(term); });
  const answers = setupCustomerAnswers(panel);
  const sampleAnswer = panel.querySelector('.smart-answers-sample');
  const englishAnswer = [...sampleAnswer.querySelectorAll('summary, .smart-answers-sample__note, strong, .smart-answers-sample__card > p:nth-child(3), a')].map(node => [node, node.textContent]);
  const spanishAnswer = ['Ejemplo de Smart Answers', 'Un ejemplo fijo con contenido ficticio.', '¿Qué incluye la exposición del Centro de Rehabilitación?', 'Incluye la distribución de un apartamento modelo y planos de mobiliario ajustable. Los dibujos de las paredes señalan puertas, zonas de circulación y movimiento.', 'Lee la página del Centro de Rehabilitación en inglés'];
  const sampleBanner = createSampleExternalPromotion();
  const bannerLink = sampleBanner.querySelector('a');
  const englishBannerTitle = bannerLink.textContent;
  panel.querySelector('[data-exp-promotions]').before(sampleBanner);
  const remoteBanners = panel.querySelector('[data-exp-promotions]');
  let app;
  let active;
  let suggestions;
  let relatedTerms;
  let answerQuery;

  function clear() {
    answers.clear();
    answerQuery = undefined;
    related.clear();
    setSuggestions(null);
    sampleAnswer.hidden = true;
    sampleBanner.hidden = true;
    remoteBanners.replaceChildren();
    app = active = undefined;
  }

  return {
    clear,
    update(design, connection, profile, query) {
      if (app !== connection || active !== profile) {
        clear();
        app = connection;
        active = profile;
        const es = active.language.split(/[-_]/)[0] === 'es';
        related.setLabel(es ? 'Búsquedas relacionadas' : 'Related searches');
        englishAnswer.forEach(([node, text], i) => { node.textContent = es ? spanishAnswer[i] : text; });
        sampleAnswer.lang = es ? 'es' : 'en';
        const bannerLabel = es ? 'Promoción externa de ejemplo' : 'Sample external promotion';
        sampleBanner.setAttribute('aria-label', bannerLabel);
        sampleBanner.querySelector('p').textContent = bannerLabel;
        bannerLink.textContent = es ? 'Lee el aviso ficticio de citas de vacunación' : englishBannerTitle;
        suggestions = app
          ? app.suggestEndpoint && createCustomerSuggestionSource({ ...app, ...active }, app.suggestEndpoint)
          : active.language === 'es' ? spanishSuggestions : sampleSuggestionSource;
        const entitled = app ? app.configuration?.entitlements.relatedSearches : true;
        relatedTerms = featureStatus(entitled, active.relatedSearches) !== 'On' ? null
          : app ? relatedSource(app.relatedURL, app.discoveryKey, active.language, active.profile)
          : active.language === 'es' ? relatedSpanish : relatedEnglish;
      }
      setSuggestions(app || design.showSuggestions ? suggestions : null);
      void related.show(panel.querySelector('#lab-exp-results'), app && design.relatedPlacement === 'off' ? 'below' : design.relatedPlacement, query, relatedTerms);
      sampleAnswer.hidden = Boolean(app) || !active.smartAnswers || !design.showSmartAnswersSample;
      if (sampleAnswer.hidden) sampleAnswer.open = false;
      updateSampleExternalPromotion(sampleBanner, app ? 'off' : promotionMode(query, design.samplePromotions));
      if (app?.answerEndpoint && featureStatus(app.configuration?.entitlements.smartAnswers, active.smartAnswers) === 'On' && answerQuery !== query) {
        answerQuery = query;
        if (query) void answers.start({ ...app, ...active }, query);
        else answers.clear();
      }
    },
    showExternalPromotions(promotions) {
      remoteBanners.replaceChildren(...promotions.map(({ title, url, description }) => {
        const banner = document.createElement('section');
        banner.className = 'search-promotion-banner';
        banner.setAttribute('aria-label', 'Promoted link');
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = title;
        banner.append(link);
        if (description) {
          const text = document.createElement('p');
          text.textContent = description;
          banner.append(text);
        }
        return banner;
      }));
    },
  };
}
