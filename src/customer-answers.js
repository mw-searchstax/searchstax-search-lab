import { webURL } from './web-url.js';
import { contentLanguageTag } from './content-language.js';

/** @typedef {{ token: string, profile: string, language: string, answerEndpoint?: string, submitAnswerFeedback?: SubmitAnswerFeedback }} AnswerConnection */
/** @typedef {{ submissionId: string, rating: 'up' | 'down', question: string, profile: string, language: string, answer: string }} AnswerRating */
/** @typedef {(rating: AnswerRating, options: { signal: AbortSignal }) => Promise<void>} SubmitAnswerFeedback */
const answerLimit = 65536;
const frameBoundary = /\r\n\r\n|\n\n|\r\r|\n\r\n|\r\n\n/;
const referenceDefinition = /^ {0,3}\[([^\]\r\n]+)\]:[ \t]*(<[^>\r\n]+>|[^\s<>]+)(?:[ \t]+"[^"\r\n]*")?[ \t]*$/gm;
const answerLink = /(!?)\[([^\]\n]+)\](?:\((<[^>\n]+>|[^\s()<>]+(?:\([^()\s]*\)[^\s()<>]*)*)(?:[ \t]+"[^"\n]*")?\)|\[([^\]\n]*)\])?/g;

/** @param {string} value */
export function readAnswerEndpoint(value) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || !url.hostname.endsWith('.searchstax.com') ||
      url.port || url.username || url.password || url.search || url.hash ||
      !/^\/api\/v1\/(?:\d+\/)?answer\/?$/.test(url.pathname)) return null;
    return url.href;
  } catch {
    return null;
  }
}

class AnswerError extends Error {}

/** @param {string} answer */
function cleanAnswer(answer) {
  return answer.replace(/\[comment\]: <> \(\{[\s\S]*?(?:\}\)|$)/g, '').trim();
}

/** @param {string} data */
function isAnswerFailure(data) {
  if (data.includes('[!CAUTION]')) return true;
  if (!data.trimStart().startsWith('{')) return false;
  try {
    return JSON.parse(data)?.success === false;
  } catch {
    return false;
  }
}

/**
 * @param {AnswerConnection & { answerEndpoint: string }} connection
 * @param {string} question
 * @param {AbortSignal} signal
 * @param {(answer: string) => void} onPartial
 */
async function requestAnswer(connection, question, signal, onPartial) {
  const url = new URL(connection.answerEndpoint);
  url.search = new URLSearchParams({ q: question, model: connection.profile }).toString();
  if (connection.language) url.searchParams.set('language', connection.language);
  const response = await fetch(url, {
    headers: { Authorization: 'Token ' + connection.token, Accept: 'text/event-stream' },
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    redirect: 'error',
    cache: 'no-store',
    signal,
  });
  if (response.status === 401 || response.status === 403) {
    throw new AnswerError('Smart Answers couldn’t access this profile. Check the read-only token and confirm Smart Answers is enabled and published.');
  }
  if (!response.ok || !response.headers.get('content-type')?.startsWith('text/event-stream') || !response.body) {
    throw new AnswerError('Smart Answers is unavailable. Check the Answer endpoint or try another search.');
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let answer = '';
  let buffer = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) throw new AnswerError('The Smart Answer was interrupted. Try your search again.');
      buffer += value;
      let receivedText = false;
      let boundary;
      while ((boundary = frameBoundary.exec(buffer))) {
        const frame = buffer.slice(0, boundary.index);
        buffer = buffer.slice(boundary.index + boundary[0].length);
        const data = frame.split(/\r\n|\r|\n/)
          .filter(line => line === 'data' || line.startsWith('data:'))
          .map(line => line.slice(5).replace(/^ /, ''))
          .join('\n');
        if (!data || data === 'I_AM_A_QUESTION') continue;
        if (data === 'I_AM_NOT_A_QUESTION') return null;
        if (data === 'CLOSE') return cleanAnswer(answer);
        if (isAnswerFailure(data) || answer.length + data.length > answerLimit) {
          throw new AnswerError('Smart Answers couldn’t generate an answer. Try another search.');
        }
        answer += data;
        receivedText = true;
      }
      if (buffer.length > answerLimit) throw new AnswerError('Smart Answers returned an unreadable response.');
      if (receivedText) onPartial(cleanAnswer(answer));
    }
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

/**
 * @param {string} answer
 * @param {boolean} linkSources
 * @returns {(Node | string)[]}
 */
function answerNodes(answer, linkSources) {
  /** @param {string} text */
  const plain = (text) => text
    .replace(/^#{1,6}[ \t]+/gm, '')
    .replace(/\*\*([^*\n]+)\*\*|__([^_\n]+)__/g, (_, bold, underline) => bold ?? underline);
  /** @type {(Node | string)[]} */
  const nodes = [];
  /** @type {Map<string, string>} */
  const references = new Map();
  const body = answer.replace(referenceDefinition, (_, name, url) => {
    references.set(name.trim().toLowerCase(), url);
    return '';
  }).trim();
  let consumed = 0;
  for (const match of body.matchAll(answerLink)) {
    const [markup, image, label, inlineURL, reference] = match;
    const address = inlineURL ?? references.get((reference || label).trim().toLowerCase());
    if (!address) continue;
    const index = match.index ?? 0;
    nodes.push(plain(body.slice(consumed, index)));
    consumed = index + markup.length;
    const href = !image && linkSources ? webURL(address.replace(/^<|>$/g, '')) : null;
    if (!href) {
      nodes.push(plain(label));
      continue;
    }
    const link = document.createElement('a');
    link.href = href;
    link.referrerPolicy = 'no-referrer';
    link.textContent = plain(label);
    nodes.push(link);
  }
  nodes.push(plain(body.slice(consumed)));
  return nodes;
}

/** @param {HTMLElement} preview */
export function setupCustomerAnswers(preview) {
  const panel = /** @type {HTMLElement} */ (preview.querySelector('[data-customer-answer]'));
  const heading = panel.querySelector('[data-customer-answer-heading]');
  const status = /** @type {HTMLElement} */ (panel.querySelector('[data-customer-answer-status]'));
  const content = /** @type {HTMLElement} */ (panel.querySelector('[data-customer-answer-content]'));
  const announcement = preview.querySelector('[data-customer-answer-announcement]');
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'smart-answer__toggle';
  toggle.hidden = true;
  content.after(toggle);
  const feedback = document.createElement('fieldset');
  feedback.className = 'smart-answer__feedback';
  feedback.hidden = true;
  feedback.innerHTML = `
    <legend>Was this answer helpful?</legend>
    <button type="button">Thumbs up</button>
    <button type="button">Thumbs down</button>
    <p class="smart-answer__feedback-status" role="status" aria-atomic="true" tabindex="-1"></p>
    <button type="button" hidden>Retry feedback</button>`;
  const [up, down, retry] = feedback.querySelectorAll('button');
  const feedbackStatus = /** @type {HTMLElement} */ (feedback.querySelector('[role="status"]'));
  toggle.after(feedback);
  /** @type {{ question: string, profile: string, language: string, answer: string, send: SubmitAnswerFeedback } | null} */
  let feedbackAnswer = null;
  /** @type {{ rating: AnswerRating, controller: AbortController, state: 'sending' | 'failed' | 'sent' } | null} */
  let submission = null;
  let showFeedback = false;
  /** @type {AbortController | null} */
  let current = null;
  let completedAnswer = null;
  let expanded = false;
  let wordLimit = 100;

  function resetToggle() {
    expanded = false;
    toggle.hidden = true;
    toggle.textContent = 'Show more';
    toggle.setAttribute('aria-expanded', 'false');
  }

  /**
   * Keep complete source links intact while placing the tail of a long answer
   * behind an ordinary keyboard-accessible button.
   */
  function limitAnswer() {
    resetToggle();
    const boundary = [...content.textContent.matchAll(/\S+/g)][wordLimit]?.index;
    if (boundary === undefined) return;
    const nodes = [...content.childNodes];
    let offset = 0;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const text = node.textContent ?? '';
      const end = offset + text.length;
      if (end <= boundary) {
        offset = end;
        continue;
      }
      const overflow = document.createElement('span');
      overflow.className = 'smart-answer__overflow';
      overflow.hidden = true;
      if (node.nodeType === Node.TEXT_NODE) {
        const split = boundary - offset;
        node.textContent = text.slice(0, split);
        overflow.append(text.slice(split));
      } else {
        overflow.append(node);
      }
      while (nodes[++i]) overflow.append(nodes[i]);
      content.append(overflow);
      toggle.hidden = false;
      return;
    }
  }

  /** @param {string} answer */
  function renderCompleteAnswer(answer) {
    content.replaceChildren(...answerNodes(answer, true));
    content.hidden = false;
    limitAnswer();
  }

  toggle.addEventListener('click', () => {
    const overflow = content.querySelector('.smart-answer__overflow');
    if (!overflow) return;
    expanded = !expanded;
    overflow.hidden = !expanded;
    toggle.textContent = expanded ? 'Show less' : 'Show more';
    toggle.setAttribute('aria-expanded', String(expanded));
  });

  /** @param {string} message */
  function setStatus(message) {
    status.textContent = message;
    if (announcement) announcement.textContent = message;
  }

  /** @param {AnswerRating['rating']} rating */
  function rateAnswer(rating) {
    if (feedback.hidden || !feedbackAnswer || submission) return;
    const { question, profile, language, answer } = feedbackAnswer;
    const vote = { submissionId: crypto.randomUUID(), rating, question, profile, language, answer };
    up.setAttribute('aria-disabled', 'true');
    down.setAttribute('aria-disabled', 'true');
    sendFeedback(vote);
  }

  /** @param {AnswerRating} rating */
  async function sendFeedback(rating) {
    if (feedback.hidden || !feedbackAnswer) return;
    const controller = new AbortController();
    const attempt = /** @type {NonNullable<typeof submission>} */ ({ rating, controller, state: 'sending' });
    submission = attempt;
    retry.setAttribute('aria-disabled', 'true');
    feedbackStatus.textContent = 'Sending feedback…';
    try {
      await feedbackAnswer.send({ ...rating }, { signal: controller.signal });
      if (submission !== attempt) return;
      attempt.state = 'sent';
      feedbackStatus.textContent = 'Thanks for your feedback.';
      if (document.activeElement === retry) feedbackStatus.focus();
      retry.hidden = true;
    } catch {
      if (submission !== attempt) return;
      attempt.state = 'failed';
      feedbackStatus.textContent = 'Feedback couldn’t be sent. Try again.';
      retry.removeAttribute('aria-disabled');
      retry.hidden = false;
    }
  }

  up.addEventListener('click', () => rateAnswer('up'));
  down.addEventListener('click', () => rateAnswer('down'));
  retry.addEventListener('click', () => {
    if (submission?.state === 'failed') sendFeedback(submission.rating);
  });

  function clear() {
    current?.abort();
    current = null;
    completedAnswer = null;
    if (submission?.state === 'sending') submission.controller.abort();
    submission = null;
    feedbackAnswer = null;
    feedback.hidden = true;
    feedbackStatus.textContent = '';
    up.removeAttribute('aria-disabled');
    down.removeAttribute('aria-disabled');
    retry.hidden = true;
    resetToggle();
    panel.hidden = true;
    setStatus('');
    content.replaceChildren();
    content.removeAttribute('lang');
    content.hidden = true;
  }

  /**
   * @param {AnswerConnection} connection
   * @param {string} question
   */
  async function start(connection, question) {
    clear();
    if (!connection.answerEndpoint) return;
    const language = contentLanguageTag(connection.language);
    if (language) content.lang = language;
    const controller = new AbortController();
    current = controller;
    panel.hidden = false;
    setStatus('Generating a Smart Answer…');
    const timer = window.setTimeout(() => controller.abort(), 45000);
    try {
      const answer = await requestAnswer({ ...connection, answerEndpoint: connection.answerEndpoint }, question,
        controller.signal, text => {
          if (current !== controller || !text) return;
          content.replaceChildren(...answerNodes(text, false));
          content.hidden = false;
        });
      if (current !== controller) return;
      if (answer === null) {
        clear();
      } else if (answer) {
        completedAnswer = answer;
        renderCompleteAnswer(answer);
        setStatus('Smart Answer ready.');
        const send = connection.submitAnswerFeedback ?? globalThis.SearchLabSubmitAnswerFeedback;
        if (typeof send === 'function') {
          feedbackAnswer = { question, profile: connection.profile, language: connection.language, answer, send };
          feedback.hidden = !showFeedback;
        }
      } else {
        setStatus('No Smart Answer was returned for this search.');
      }
    } catch (error) {
      if (current !== controller) return;
      content.replaceChildren();
      content.hidden = true;
      setStatus(error instanceof AnswerError ? error.message
        : 'Smart Answers is unavailable. Check the Answer endpoint or try another search.');
    } finally {
      window.clearTimeout(timer);
      if (current === controller) current = null;
    }
  }

  return {
    clear,
    start,
    /** @param {{ smartAnswerHeading?: string, smartAnswerCardStyle?: string, smartAnswerSourceStyle?: string, smartAnswerWordLimit?: number, showSmartAnswerFeedback?: boolean }} design */
    setAppearance(design) {
      const label = design.smartAnswerHeading?.trim() || 'Smart Answer';
      heading.textContent = label;
      if (panel.hasAttribute('aria-label')) panel.setAttribute('aria-label', label);
      panel.classList.toggle('smart-answer--outline', design.smartAnswerCardStyle === 'outline');
      panel.classList.toggle('smart-answer--source-cards', design.smartAnswerSourceStyle === 'cards');
      const previousLimit = wordLimit;
      wordLimit = Number.isSafeInteger(design.smartAnswerWordLimit) && design.smartAnswerWordLimit > 0
        ? design.smartAnswerWordLimit : 100;
      if (completedAnswer && previousLimit !== wordLimit) renderCompleteAnswer(completedAnswer);
      showFeedback = design.showSmartAnswerFeedback === true;
      feedback.hidden = !showFeedback || !feedbackAnswer;
    },
  };
}
