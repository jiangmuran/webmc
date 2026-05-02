// Goat horn. Dropped when a goat rams a solid block (log, stone,
// copper_block, iron_block, etc.). Each goat has 2 horns; can drop up
// to 2 distinct.

export interface Goat {
  hornsRemaining: number; // 0..2
  screaming: boolean;
}

export const MAX_HORNS = 2;

// Wiki (minecraft.wiki/w/Goat#Goat_horns): "An adult goat ... will
// lose one of [its horns] and drop a goat horn if it charges into
// any of the following solid blocks: stone, coal ore, copper ore,
// iron ore, emerald ore, logs, or packed ice." Java tag
// `snaps_goat_horn` resolves "logs" through the `#minecraft:logs`
// tag, which includes ALL log/stem variants — base, stripped, wood,
// hyphae, plus bamboo block and stripped bamboo block.
//
// Old set had only the bare *_log family — stripped logs, wood blocks,
// hyphae, and bamboo blocks dropped no horn even though the wiki
// `logs` tag classifies them as horn-snapping.
const NON_LOG_RAMMABLE = new Set<string>([
  'webmc:stone',
  'webmc:coal_ore',
  'webmc:copper_ore',
  'webmc:iron_ore',
  'webmc:emerald_ore',
  'webmc:packed_ice',
]);

export function canRamDropHorn(blockId: string): boolean {
  if (NON_LOG_RAMMABLE.has(blockId)) return true;
  // Java #minecraft:logs membership: log / stem / hyphae / wood /
  // stripped variants + bamboo block + stripped bamboo block.
  const stripped = blockId.replace(/^webmc:/, '');
  if (
    stripped.endsWith('_log') ||
    stripped.endsWith('_wood') ||
    stripped.endsWith('_hyphae') ||
    stripped.endsWith('_stem') ||
    stripped === 'bamboo_block' ||
    stripped === 'stripped_bamboo_block'
  ) {
    return true;
  }
  return false;
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
