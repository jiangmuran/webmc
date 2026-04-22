// Lightweight replay recorder. Captures inputs + world edits with
// timestamps; enables deterministic playback.

export type ReplayEvent =
  | { t: number; kind: 'input'; payload: { dx: number; dy: number; jump: boolean } }
  | { t: number; kind: 'edit'; payload: { x: number; y: number; z: number; blockId: string } }
  | { t: number; kind: 'chat'; payload: { player: string; text: string } };

export class ReplayBuffer {
  private events: ReplayEvent[] = [];

  start(_nowMs: number): void {
    this.events = [];
  }

  record(e: ReplayEvent): void {
    this.events.push(e);
  }

  size(): number {
    return this.events.length;
  }

  // Serialize to a compact JSON-safe array.
  serialize(): ReplayEvent[] {
    return [...this.events];
  }

  replayRange(fromMs: number, toMs: number): ReplayEvent[] {
    return this.events.filter((e) => e.t >= fromMs && e.t < toMs);
  }

  trimBefore(nowMs: number, keepWindowMs: number): number {
    const cutoff = nowMs - keepWindowMs;
    const before = this.events.length;
    this.events = this.events.filter((e) => e.t >= cutoff);
    return before - this.events.length;
  }

  clear(): void {
    this.events = [];
  }
}
