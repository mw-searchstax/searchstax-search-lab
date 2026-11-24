import { webURL } from './web-url.js';
import { contentLanguageTag } from './content-language.js';

/** @typedef {{ token: string, profile: string, language: string, answerEndpoint?: string }} AnswerConnection */
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
  const status = /** @type {HTMLElement} */ (panel.querySelector('[data-customer-answer-status]'));
  const content = /** @type {HTMLElement} */ (panel.querySelector('[data-customer-answer-content]'));
  const announcement = preview.querySelector('[data-customer-answer-announcement]');
  /** @type {AbortController | null} */
  let current = null;

  /** @param {string} message */
  function setStatus(message) {
    status.textContent = message;
    if (announcement) announcement.textContent = message;
  }

  function clear() {
    current?.abort();
    current = null;
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
        content.replaceChildren(...answerNodes(answer, true));
        content.hidden = false;
        setStatus('Smart Answer ready.');
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

  return { clear, start };
}
