import { readAnswerEndpoint, setupCustomerAnswers } from './customer-answers.js';

/** @param {string} value */
function starterAnswerEndpoint(value) {
  const searchstaxURL = readAnswerEndpoint(value);
  if (searchstaxURL) return searchstaxURL;
  try {
    const url = new URL(value, window.location.href);
    if (url.origin === window.location.origin && !url.username && !url.password && !url.search && !url.hash) {
      return url.href;
    }
  } catch { /* Show configuration feedback for an invalid endpoint. */ }
  return null;
}

/**
 * @param {HTMLElement} host
 * @param {{ questionURL: string, searchAuth: string, model: string, language: string }} connection
 */
export function setupStarterAnswers(host, connection) {
  host.innerHTML = `
    <p class="search-starter__sr-only" role="status" data-customer-answer-announcement></p>
    <section class="smart-answers-sample__card search-starter__answer" aria-label="Smart Answer" data-customer-answer hidden>
      <h2>Smart Answer</h2>
      <p data-customer-answer-status></p>
      <div class="search-starter__answer-content" data-customer-answer-content hidden></div>
    </section>`;

  const answers = setupCustomerAnswers(host);
  const answerEndpoint = starterAnswerEndpoint(connection.questionURL.trim());
  const profile = connection.model?.trim();
  if (!answerEndpoint || !profile) {
    const panel = host.querySelector('[data-customer-answer]');
    const status = host.querySelector('[data-customer-answer-status]');
    if (panel instanceof HTMLElement && status) {
      panel.hidden = false;
      status.textContent = 'Set a Search Profile and a valid streaming Answer endpoint to use Smart Answers.';
    }
    return;
  }

  const answerConnection = { answerEndpoint, profile, language: connection.language, token: connection.searchAuth };
  return {
    clear: answers.clear,
    /** @param {string} query */
    start(query) {
      if (query === '*') {
        answers.clear();
        return;
      }
      void answers.start(answerConnection, query);
    },
  };
}
