export type Priority = 'critical' | 'high' | 'normal' | 'low';

export interface QueuedPacket {
  priority: Priority;
  enqueuedAtMs: number;
  bytes: number;
}

const ORDER: Record<Priority, number> = { critical: 0, high: 1, normal: 2, low: 3 };

export function nextToSend(queue: QueuedPacket[]): QueuedPacket | undefined {
  if (queue.length === 0) return undefined;
  return [...queue].sort((a, b) => {
    const o = ORDER[a.priority] - ORDER[b.priority];
    if (o !== 0) return o;
    return a.enqueuedAtMs - b.enqueuedAtMs;
  })[0];
}

export function ageMsExceedsBudget(p: QueuedPacket, nowMs: number, budgetMs: number): boolean {
  return nowMs - p.enqueuedAtMs > budgetMs;
}
