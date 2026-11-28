import type { DesignSettings } from './design';

export type SubmitAnswerFeedback = (
  vote: { submissionId: string; rating: 'up' | 'down'; question: string; profile: string; language: string; answer: string },
  options: { signal: AbortSignal },
) => Promise<void>;

type AnswerConnection = {
  token: string;
  profile: string;
  language: string;
  answerEndpoint?: string;
  submitAnswerFeedback?: SubmitAnswerFeedback;
};

export function readAnswerEndpoint(value: string): string | null;

export function setupCustomerAnswers(preview: HTMLElement): {
  clear: () => void;
  start: (connection: AnswerConnection, question: string) => Promise<void>;
  setAppearance: (design: Partial<Pick<DesignSettings, 'smartAnswerHeading' | 'smartAnswerCardStyle' | 'smartAnswerSourceStyle' | 'smartAnswerWordLimit' | 'showSmartAnswerFeedback'>>) => void;
};
