// Replay recorder. Captures a rolling buffer of input + state snapshots
// for "death cam" playback (last 20s) and optionally a full-session
// .webmcreplay export. Uses the codec from /net for compact binary
// encoding.

export interface ReplayFrame {
  tsMs: number;
  playerPos: { x: number; y: number; z: number };
  playerYaw: number;
  playerPitch: number;
  currentHealth: number;
  heldItem: string | null;
  action: 'idle' | 'break' | 'place' | 'attack' | 'use' | 'jump' | 'sprint';
}

export interface ReplayOptions {
  bufferSec: number; // rolling window
  sampleHz: number; // frames per second
}

export class ReplayRecorder {
  private readonly buffer: ReplayFrame[] = [];
  private readonly maxFrames: number;
  private lastSampleMs = -Infinity;
  private readonly sampleIntervalMs: number;
  private recording = true;

  constructor(opts: ReplayOptions) {
    this.maxFrames = Math.max(1, Math.floor(opts.bufferSec * opts.sampleHz));
    this.sampleIntervalMs = 1000 / opts.sampleHz;
  }

  observe(frame: ReplayFrame): boolean {
    if (!this.recording) return false;
    if (frame.tsMs - this.lastSampleMs < this.sampleIntervalMs) return false;
    this.buffer.push(frame);
    this.lastSampleMs = frame.tsMs;
    while (this.buffer.length > this.maxFrames) this.buffer.shift();
    return true;
  }

  pause(): void {
    this.recording = false;
  }

  resume(): void {
    this.recording = true;
  }

  clear(): void {
    this.buffer.length = 0;
  }

  snapshot(): readonly ReplayFrame[] {
    return [...this.buffer];
  }

  get size(): number {
    return this.buffer.length;
  }
}

// Slice the replay to the last N seconds before `endTsMs` — typically
// called on player death to produce the death-cam clip.
export function sliceLast(
  frames: readonly ReplayFrame[],
  endTsMs: number,
  secondsBack: number,
): ReplayFrame[] {
  const cutoff = endTsMs - secondsBack * 1000;
  return frames.filter((f) => f.tsMs >= cutoff && f.tsMs <= endTsMs);
}

// Encode/decode helpers: simplified JSON shape; production would use
// the binary codec. Kept JSON for testability and easy diff in demos.
export function encodeReplay(frames: readonly ReplayFrame[]): string {
  return JSON.stringify(frames);
}

export function decodeReplay(blob: string): ReplayFrame[] {
  try {
    const parsed = JSON.parse(blob) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as ReplayFrame[];
  } catch {
    return [];
  }
}
