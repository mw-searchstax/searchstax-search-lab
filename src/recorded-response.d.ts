export function replayRecordedResponse<T extends Record<string, unknown>>(
  catalog: Record<string, Record<string, T>>, searchParams: URLSearchParams,
): T | undefined;
