// Block update scheduling. When a block changes state, neighbors are
// enqueued for tick-level re-evaluation at a given delay.

export interface ScheduledUpdate {
  x: number;
  y: number;
  z: number;
  blockId: string;
  delayTicks: number;
  priority: 'low' | 'normal' | 'high';
}

export interface UpdateQueue {
  items: ScheduledUpdate[];
}

export function makeQueue(): UpdateQueue {
  return { items: [] };
}

export function enqueue(q: UpdateQueue, u: ScheduledUpdate): void {
  q.items.push(u);
}

export function drainDue(q: UpdateQueue): ScheduledUpdate[] {
  const due: ScheduledUpdate[] = [];
  const remaining: ScheduledUpdate[] = [];
  for (const u of q.items) {
    if (u.delayTicks <= 0) due.push(u);
    else remaining.push({ ...u, delayTicks: u.delayTicks - 1 });
  }
  q.items = remaining;
  // Sort by priority: high > normal > low.
  due.sort((a, b) => weight(b.priority) - weight(a.priority));
  return due;
}

function weight(p: ScheduledUpdate['priority']): number {
  return p === 'high' ? 3 : p === 'normal' ? 2 : 1;
}

export function pending(q: UpdateQueue): number {
  return q.items.length;
}
