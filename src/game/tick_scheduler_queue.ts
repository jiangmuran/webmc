export interface ScheduledTick {
  x: number;
  y: number;
  z: number;
  fireAtTick: number;
  priority: number;
  kind: string;
}

export class TickQueue {
  private tasks: ScheduledTick[] = [];

  schedule(t: ScheduledTick): void {
    this.tasks.push(t);
  }

  drainDueBy(currentTick: number): ScheduledTick[] {
    const due = this.tasks
      .filter((t) => t.fireAtTick <= currentTick)
      .sort((a, b) => a.fireAtTick - b.fireAtTick || a.priority - b.priority);
    this.tasks = this.tasks.filter((t) => t.fireAtTick > currentTick);
    return due;
  }

  pendingCount(): number {
    return this.tasks.length;
  }

  cancelAt(x: number, y: number, z: number, kind: string): number {
    const before = this.tasks.length;
    this.tasks = this.tasks.filter(
      (t) => !(t.x === x && t.y === y && t.z === z && t.kind === kind),
    );
    return before - this.tasks.length;
  }
}
