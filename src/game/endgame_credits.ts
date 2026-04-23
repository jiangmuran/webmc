// End poem + credits scroll after first dragon defeat + exit portal entry.

export interface CreditsProgress {
  startedAtMs: number;
  durationMs: number;
  dismissed: boolean;
}

export const DEFAULT_CREDITS_DURATION_MS = 8 * 60 * 1000; // 8 min

export function startCredits(nowMs: number): CreditsProgress {
  return { startedAtMs: nowMs, durationMs: DEFAULT_CREDITS_DURATION_MS, dismissed: false };
}

export function progress01(p: CreditsProgress, nowMs: number): number {
  if (p.dismissed) return 1;
  const elapsed = Math.max(0, nowMs - p.startedAtMs);
  return Math.min(1, elapsed / p.durationMs);
}

export function dismiss(p: CreditsProgress): CreditsProgress {
  return { ...p, dismissed: true };
}

// Only shows on first dragon defeat per player.
export function shouldShow(firstDragonDefeat: boolean): boolean {
  return firstDragonDefeat;
}
