export interface Toast {
  message: string;
  category: 'info' | 'warn' | 'error';
  enqueuedAtMs: number;
  durationMs: number;
}

export const DEFAULT_DURATION_MS = 5000;

export function activeToasts(toasts: Toast[], nowMs: number): Toast[] {
  return toasts.filter((t) => nowMs - t.enqueuedAtMs < t.durationMs);
}

export function pushToast(toasts: Toast[], t: Toast, max = 5): Toast[] {
  const next = [...toasts, t];
  return next.slice(-max);
}
