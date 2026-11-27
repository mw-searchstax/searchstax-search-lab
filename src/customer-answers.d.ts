type AnswerConnection = {
  token: string;
  profile: string;
  language: string;
  answerEndpoint?: string;
};

export function readAnswerEndpoint(value: string): string | null;

export function setupCustomerAnswers(preview: HTMLElement): {
  clear: () => void;
  start: (connection: AnswerConnection, question: string) => Promise<void>;
  setAppearance: (design: { smartAnswerHeading?: string; smartAnswerCardStyle?: string; smartAnswerSourceStyle?: string; smartAnswerWordLimit?: number }) => void;
};
