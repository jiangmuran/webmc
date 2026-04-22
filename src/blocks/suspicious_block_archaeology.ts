// Suspicious sand / gravel. Brush to reveal an item; takes 8 brush
// strokes at 100ms each. If interrupted (player leaves), progress
// resets.

export type SuspiciousKind = 'suspicious_sand' | 'suspicious_gravel';

export interface SuspiciousBlock {
  kind: SuspiciousKind;
  lootItemId: string;
  brushStrokes: number;
  lastBrushedMs: number;
}

export const STROKES_REQUIRED = 8;
export const INTERRUPT_MS = 200;

export function makeSuspicious(kind: SuspiciousKind, loot: string): SuspiciousBlock {
  return { kind, lootItemId: loot, brushStrokes: 0, lastBrushedMs: -Infinity };
}

export interface BrushQuery {
  nowMs: number;
}

export interface BrushResult {
  revealed: boolean;
  progress: number; // 0..1
}

export function brush(b: SuspiciousBlock, q: BrushQuery): BrushResult {
  if (q.nowMs - b.lastBrushedMs > INTERRUPT_MS) {
    b.brushStrokes = 0;
  }
  b.brushStrokes += 1;
  b.lastBrushedMs = q.nowMs;
  const progress = b.brushStrokes / STROKES_REQUIRED;
  return { revealed: b.brushStrokes >= STROKES_REQUIRED, progress: Math.min(1, progress) };
}

// Loot tables by biome: desert vs warm_ocean_ruin vs cold ruin.
export const SUSPICIOUS_SAND_LOOT = [
  { itemId: 'webmc:pottery_sherd_archer', weight: 1 },
  { itemId: 'webmc:pottery_sherd_miner', weight: 1 },
  { itemId: 'webmc:emerald', weight: 2 },
  { itemId: 'webmc:brick', weight: 2 },
  { itemId: 'webmc:diamond', weight: 1 },
];

export const SUSPICIOUS_GRAVEL_LOOT = [
  { itemId: 'webmc:iron_nugget', weight: 5 },
  { itemId: 'webmc:leather', weight: 5 },
  { itemId: 'webmc:pottery_sherd_danger', weight: 1 },
  { itemId: 'webmc:pottery_sherd_brewer', weight: 1 },
];
