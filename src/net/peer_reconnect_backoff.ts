export const INITIAL_DELAY_MS = 1000;
export const MAX_DELAY_MS = 30000;

export function nextDelayMs(attempt: number): number {
  const delay = INITIAL_DELAY_MS * Math.pow(2, Math.max(0, attempt));
  return Math.min(MAX_DELAY_MS, delay);
}

export function shouldGiveUp(attempt: number, maxAttempts: number): boolean {
  return attempt >= maxAttempts;
}
