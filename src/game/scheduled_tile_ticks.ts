// Scheduled tile tick queue. Blocks schedule delayed updates (water
// flow, fire spread, piston move, etc.) with a priority. World
// processes all ticks with scheduledTick <= currentTick.

export interface ScheduledTick {
  x: number;
  y: number;
  z: number;
  blockId: string;
  scheduledTick: number;
  priority: number;
}

export class TileTickQueue {
  private entries: ScheduledTick[] = [];

  schedule(t: ScheduledTick): void {
    this.entries.push(t);
  }

  // Returns due ticks in priority order, removing them from the queue.
  collectDue(currentTick: number, maxCount = 1000): ScheduledTick[] {
    const due: ScheduledTick[] = [];
    const remaining: ScheduledTick[] = [];
    for (const e of this.entries) {
      if (e.scheduledTick <= currentTick && due.length < maxCount) due.push(e);
      else remaining.push(e);
    }
    this.entries = remaining;
    due.sort((a, b) => a.priority - b.priority || a.scheduledTick - b.scheduledTick);
    return due;
  }

  get size(): number {
    return this.entries.length;
  }

  // Dedupe: remove all scheduled ticks at the given cell + blockId (useful
  // when a block is replaced / breaks).
  drop(x: number, y: number, z: number, blockId: string | null = null): number {
    const before = this.entries.length;
    this.entries = this.entries.filter((e) => {
      if (e.x !== x || e.y !== y || e.z !== z) return true;
      if (blockId !== null && e.blockId !== blockId) return true;
      return false;
    });
    return before - this.entries.length;
  }
}
