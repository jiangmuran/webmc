// Delayed/periodic tick scheduler. Queue tasks keyed by next tick;
// drain all due tasks in order each tick.

export interface ScheduledTask {
  fireAtTick: number;
  fn: () => void;
  repeatEvery?: number;
  id: number;
}

export interface Scheduler {
  tasks: ScheduledTask[];
  nextId: number;
}

export function makeScheduler(): Scheduler {
  return { tasks: [], nextId: 1 };
}

export function schedule(
  s: Scheduler,
  fn: () => void,
  delayTicks: number,
  repeatEvery?: number,
): number {
  const id = s.nextId++;
  const task: ScheduledTask = { fireAtTick: delayTicks, fn, id };
  if (repeatEvery !== undefined) task.repeatEvery = repeatEvery;
  s.tasks.push(task);
  return id;
}

export function cancel(s: Scheduler, id: number): boolean {
  const before = s.tasks.length;
  s.tasks = s.tasks.filter((t) => t.id !== id);
  return s.tasks.length < before;
}

export function drainDue(s: Scheduler, nowTick: number): number {
  let fired = 0;
  const remaining: ScheduledTask[] = [];
  for (const t of s.tasks) {
    if (t.fireAtTick <= nowTick) {
      t.fn();
      fired++;
      if (t.repeatEvery) {
        remaining.push({ ...t, fireAtTick: nowTick + t.repeatEvery });
      }
    } else {
      remaining.push(t);
    }
  }
  s.tasks = remaining;
  return fired;
}

export function pending(s: Scheduler): number {
  return s.tasks.length;
}
