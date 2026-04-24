export interface BlockActionRate {
  peerId: string;
  actionsInWindow: number;
  windowStartMs: number;
}

export const WINDOW_MS = 1000;
export const MAX_ACTIONS_PER_SECOND = 20;

export function tick(r: BlockActionRate, nowMs: number): BlockActionRate {
  if (nowMs - r.windowStartMs >= WINDOW_MS) {
    return { ...r, actionsInWindow: 0, windowStartMs: nowMs };
  }
  return r;
}

export function recordAction(
  r: BlockActionRate,
  nowMs: number,
): { record: BlockActionRate; accepted: boolean } {
  const t = tick(r, nowMs);
  if (t.actionsInWindow >= MAX_ACTIONS_PER_SECOND) {
    return { record: t, accepted: false };
  }
  return { record: { ...t, actionsInWindow: t.actionsInWindow + 1 }, accepted: true };
}
