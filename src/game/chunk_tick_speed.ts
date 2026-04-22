// Random tick speed. Every game tick, N random blocks in each loaded
// sub-chunk receive a "random tick" — crop growth, leaf decay, ice
// melting, fire spread, coral death, snow accumulation, etc. Default
// is 3; the randomTickSpeed gamerule controls it.

export const DEFAULT_RANDOM_TICK_SPEED = 3;

export interface RandomTickQuery {
  subChunkSize: number; // 16 in MC; configurable for tests
  tickSpeed: number;
  rng: () => number;
}

export interface TickedCoord {
  x: number;
  y: number;
  z: number;
}

export function rollRandomTicks(q: RandomTickQuery): TickedCoord[] {
  const out: TickedCoord[] = [];
  const limit = Math.max(0, Math.floor(q.tickSpeed));
  for (let i = 0; i < limit; i++) {
    const idx = Math.floor(q.rng() * q.subChunkSize * q.subChunkSize * q.subChunkSize);
    const x = idx & (q.subChunkSize - 1);
    const z = (idx >> logBase2(q.subChunkSize)) & (q.subChunkSize - 1);
    const y = idx >> (2 * logBase2(q.subChunkSize));
    out.push({ x, y, z });
  }
  return out;
}

function logBase2(n: number): number {
  return Math.round(Math.log2(n));
}

// Throughput estimate: how many random-tick events per second per
// loaded chunk (chunks are 16×16×384 = 24 sub-chunks).
export function eventsPerSecondPerChunk(tickSpeed: number): number {
  // 20 game ticks per second × 24 sub-chunks × tickSpeed
  return 20 * 24 * Math.max(0, tickSpeed);
}

// A per-block random-tick handler registration — the world calls the
// matching handler when its block type is selected.
export type RandomTickHandler = (pos: TickedCoord) => void;

const HANDLERS = new Map<string, RandomTickHandler>();

export function registerRandomTick(blockId: string, fn: RandomTickHandler): void {
  HANDLERS.set(blockId, fn);
}

export function dispatchRandomTick(blockId: string, pos: TickedCoord): boolean {
  const h = HANDLERS.get(blockId);
  if (!h) return false;
  h(pos);
  return true;
}
