// Tick scheduler fairness. Given a tick budget (e.g., 15ms), run task
// queue in priority order; each task may split itself into batches.

export interface TickBudget {
  totalMs: number;
  usedMs: number;
  nowMs: () => number;
  startMs: number;
}

export function makeBudget(totalMs: number, nowMs: () => number): TickBudget {
  const startMs = nowMs();
  return { totalMs, usedMs: 0, nowMs, startMs };
}

export function remainingMs(b: TickBudget): number {
  return Math.max(0, b.totalMs - (b.nowMs() - b.startMs));
}

export function isExhausted(b: TickBudget): boolean {
  return remainingMs(b) <= 0;
}

// Task runner: each Task advances until either done or budget
// exhausted. Resumable state stored on the task itself.
export interface ChunkedTask {
  id: string;
  priority: number;
  run: (maxMs: number) => 'done' | 'yielded';
}

export class TickScheduler {
  private tasks: ChunkedTask[] = [];

  post(t: ChunkedTask): void {
    this.tasks.push(t);
    this.tasks.sort((a, b) => b.priority - a.priority);
  }

  run(b: TickBudget): { completed: string[] } {
    const completed: string[] = [];
    while (this.tasks.length > 0 && !isExhausted(b)) {
      const t = this.tasks[0];
      if (!t) break;
      const r = t.run(remainingMs(b));
      if (r === 'done') {
        this.tasks.shift();
        completed.push(t.id);
      } else {
        // task yielded; break to respect budget
        break;
      }
    }
    return { completed };
  }

  get pending(): number {
    return this.tasks.length;
  }
}
