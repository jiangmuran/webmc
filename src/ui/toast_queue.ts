export interface Toast {
  id: string;
  title: string;
  subtitle?: string;
  kind: 'advancement' | 'recipe' | 'system';
  durationMs: number;
  shownAtMs?: number;
}

export const MAX_VISIBLE = 3;

export function visibleToasts(queue: readonly Toast[], nowMs: number): readonly Toast[] {
  return queue
    .filter((t) => t.shownAtMs !== undefined && nowMs - t.shownAtMs < t.durationMs)
    .slice(0, MAX_VISIBLE);
}

export function promoteNext(queue: readonly Toast[], nowMs: number): readonly Toast[] {
  const visible = visibleToasts(queue, nowMs).length;
  let remaining = MAX_VISIBLE - visible;
  return queue.map((t) => {
    if (t.shownAtMs === undefined && remaining > 0) {
      remaining--;
      return { ...t, shownAtMs: nowMs };
    }
    return t;
  });
}

export function prune(queue: readonly Toast[], nowMs: number): readonly Toast[] {
  return queue.filter((t) => t.shownAtMs === undefined || nowMs - t.shownAtMs < t.durationMs);
}
