// Goat horn. Dropped when a goat rams a solid block (log, stone,
// copper_block, iron_block, etc.). Each goat has 2 horns; can drop up
// to 2 distinct.

export interface Goat {
  hornsRemaining: number; // 0..2
  screaming: boolean;
}

export const MAX_HORNS = 2;

// Wiki (minecraft.wiki/w/Goat#Goat_horns): "An adult goat ... will
// lose one of [its horns] and drop a goat horn if it charges into any
// of the following solid blocks: stone, coal ore, copper ore, iron
// ore, emerald ore, logs, or packed ice. In Java, these blocks are
// listed under the snaps_goat_horn block tag."
//
// Old list had the wrong category for two entries (copper_BLOCK and
// iron_BLOCK instead of copper_ORE and iron_ORE) and was missing all
// four ores the wiki names. It also included deepslate, which is
// neither in the wiki text nor in the snaps_goat_horn tag.
const RAMMABLE = new Set<string>([
  'webmc:stone',
  'webmc:coal_ore',
  'webmc:copper_ore',
  'webmc:iron_ore',
  'webmc:emerald_ore',
  'webmc:packed_ice',
  // All log variants
  'webmc:oak_log',
  'webmc:spruce_log',
  'webmc:birch_log',
  'webmc:jungle_log',
  'webmc:acacia_log',
  'webmc:dark_oak_log',
  'webmc:mangrove_log',
  'webmc:cherry_log',
  'webmc:pale_oak_log',
  'webmc:crimson_stem',
  'webmc:warped_stem',
]);

export function canRamDropHorn(blockId: string): boolean {
  return RAMMABLE.has(blockId);
}

export type HornKind = 'ponder' | 'sing' | 'seek' | 'feel' | 'admire' | 'call' | 'yearn' | 'dream';

// Wiki (minecraft.wiki/w/Goat): "There are four horn variants for
// normal goats ('Ponder', 'Sing', 'Seek', and 'Feel'), and four
// horn variants that only screaming goats drop ('Admire', 'Call',
// 'Yearn', and 'Dream')." Old VARIANTS array picked randomly from
// all 8, which let normal goats drop screaming-only horns (Admire,
// Call, Yearn, Dream) and vice versa.
const NORMAL_VARIANTS: HornKind[] = ['ponder', 'sing', 'seek', 'feel'];
const SCREAMING_VARIANTS: HornKind[] = ['admire', 'call', 'yearn', 'dream'];

export function ramDropHorn(g: Goat, rand: () => number): HornKind | null {
  if (g.hornsRemaining <= 0) return null;
  g.hornsRemaining -= 1;
  const pool = g.screaming ? SCREAMING_VARIANTS : NORMAL_VARIANTS;
  const idx = Math.floor(rand() * pool.length);
  return pool[idx] ?? pool[0]!;
}

// Screaming goat has higher chance per ram tick.
export function ramIntervalTicks(g: Goat): number {
  return g.screaming ? 200 : 600;
}
