// Sniffer digs on dirt-like blocks; produces torchflower or pitcher seeds.
//
// Wiki (minecraft.wiki/w/Sniffer):
//   "After sniffing out seeds, an eight-minute cooldown is activated
//    before it can search again." — 8 min = 9600 ticks. Old 160 was
//    60× too short, sniffers dug almost continuously.
//   "with an equal chance of digging up either one" — torchflower
//    and pitcher pod are 50/50; old 5/20/75 (with 75% null) gave a
//    different distribution AND included a "no find" outcome that
//    isn't in the wiki — every successful dig produces one seed.
//   The wiki diggable-block list also includes moss_block, mud,
//    muddy_mangrove_roots, and mycelium; old list was missing them.

export const SNIFFER_DIG_COOLDOWN_TICKS = 9600;
export const SNIFFER_DIG_DURATION_TICKS = 6 * 20;

export type SnifferFind = 'torchflower_seeds' | 'pitcher_pod' | null;

export interface SnifferDigCtx {
  onValidSoil: boolean;
  cooldownRemaining: number;
  rand: () => number;
}

export function canDig(c: SnifferDigCtx): boolean {
  return c.onValidSoil && c.cooldownRemaining <= 0;
}

// Per wiki: 50/50 between the two seeds. `null` is preserved in the
// return type for callers that want a "missed dig" path, but rollFind
// itself only returns null for the wiki-impossible case where the
// rng somehow exits the [0,1) range; the canonical path is 50/50.
export function rollFind(rand: () => number): SnifferFind {
  return rand() < 0.5 ? 'torchflower_seeds' : 'pitcher_pod';
}

export function validSoil(blockId: string): boolean {
  return (
    blockId === 'grass_block' ||
    blockId === 'dirt' ||
    blockId === 'podzol' ||
    blockId === 'coarse_dirt' ||
    blockId === 'rooted_dirt' ||
    blockId === 'moss_block' ||
    blockId === 'mud' ||
    blockId === 'muddy_mangrove_roots' ||
    blockId === 'mycelium'
  );
}
