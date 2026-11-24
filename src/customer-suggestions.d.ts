export function createCustomerSuggestionSource(
  connection: { token: string; language: string },
  endpoint: string,
): {
  label: string;
  language: string | undefined;
  delay: number;
  readonly minimumChars: number;
  suggest(prefix: string, signal: AbortSignal): Promise<string[]>;
};
