export interface ScheduledTick {
  x: number;
  y: number;
  z: number;
  blockId: string;
  triggerTick: number;
  priority: number;
}

export function due(pending: ScheduledTick[], now: number): ScheduledTick[] {
  return pending.filter((t) => t.triggerTick <= now);
}

export function upcoming(pending: ScheduledTick[], now: number): ScheduledTick[] {
  return pending.filter((t) => t.triggerTick > now);
}

export function sortByPriorityThenTime(list: ScheduledTick[]): ScheduledTick[] {
  return [...list].sort((a, b) => a.triggerTick - b.triggerTick || a.priority - b.priority);
}
