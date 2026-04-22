// Worker pool work queue. Tasks are posted, workers dequeue one at a
// time. Priority + cancellation supported.

export interface Task<T = unknown> {
  id: number;
  priority: number;
  payload: T;
  cancelled: boolean;
}

export class WorkQueue<T = unknown> {
  private queue: Task<T>[] = [];
  private nextId = 1;

  post(priority: number, payload: T): number {
    const id = this.nextId++;
    this.queue.push({ id, priority, payload, cancelled: false });
    return id;
  }

  cancel(id: number): boolean {
    const t = this.queue.find((x) => x.id === id);
    if (!t) return false;
    t.cancelled = true;
    return true;
  }

  popBest(): Task<T> | null {
    while (this.queue.length > 0) {
      this.queue.sort((a, b) => b.priority - a.priority || a.id - b.id);
      const t = this.queue.shift();
      if (!t) return null;
      if (t.cancelled) continue;
      return t;
    }
    return null;
  }

  get size(): number {
    return this.queue.filter((t) => !t.cancelled).length;
  }

  clear(): void {
    this.queue.length = 0;
  }
}
