// Goat horn. Dropped when a goat rams a solid block (log, stone,
// copper_block, iron_block, etc.). Each goat has 2 horns; can drop up
// to 2 distinct.

export interface Goat {
  hornsRemaining: number; // 0..2
  screaming: boolean;
}

export const MAX_HORNS = 2;

const RAMMABLE = new Set<string>([
  'webmc:stone',
  'webmc:deepslate',
  'webmc:oak_log',
  'webmc:spruce_log',
  'webmc:birch_log',
  'webmc:jungle_log',
  'webmc:acacia_log',
  'webmc:dark_oak_log',
  'webmc:mangrove_log',
  'webmc:copper_block',
  'webmc:iron_block',
  'webmc:packed_ice',
]);

export function canRamDropHorn(blockId: string): boolean {
  return RAMMABLE.has(blockId);
}

export type HornKind = 'ponder' | 'sing' | 'seek' | 'feel' | 'admire' | 'call' | 'yearn' | 'dream';

const VARIANTS: HornKind[] = ['ponder', 'sing', 'seek', 'feel', 'admire', 'call', 'yearn', 'dream'];

export function ramDropHorn(g: Goat, rand: () => number): HornKind | null {
  if (g.hornsRemaining <= 0) return null;
  g.hornsRemaining -= 1;
  const idx = Math.floor(rand() * VARIANTS.length);
  return VARIANTS[idx] ?? 'ponder';
}

// Screaming goat has higher chance per ram tick.
export function ramIntervalTicks(g: Goat): number {
  return g.screaming ? 200 : 600;
}
