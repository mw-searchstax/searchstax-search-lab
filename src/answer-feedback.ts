import type { SubmitAnswerFeedback } from './customer-answers.js';

export function readTrackingEndpoint(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || !url.hostname.endsWith('.searchstax.com') || url.port ||
      url.username || url.password || url.search || url.hash || !/^\/(?:api\/v2\/track\/?)?$/.test(url.pathname)) return null;
    url.pathname = '/api/v2/track/';
    return url.href;
  } catch {
    return null;
  }
}

export function createAnswerFeedbackSender(endpoint: string, key: string): SubmitAnswerFeedback {
  const session = crypto.randomUUID();
  const visitor = crypto.randomUUID();
  return async ({ rating, question, answer, profile, language }, { signal }) => {
    const json = JSON.stringify({ event: '_searchSatisfaction', properties: {
      key, session, _vid: visitor, score: rating === 'up' ? 10 : 0,
      comments: `Question: ${question} Answer: ${answer}`, model: profile, language,
    } });
    const bytes = new TextEncoder().encode(json);
    const body = new URLSearchParams({ data: btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join('')) });
    const response = await fetch(endpoint, {
      method: 'POST', body, credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error',
      signal: AbortSignal.any([signal, AbortSignal.timeout(12000)]),
    });
    if (response.status !== 204) throw new Error('SearchStax Analytics did not accept the feedback.');
  };
}
