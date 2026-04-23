// Sniffer digs rarely on dirt-like blocks; may produce torchflower or
// pitcher seeds.

export const SNIFFER_DIG_COOLDOWN_TICKS = 8 * 20; // 8 s between digs
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

export function rollFind(rand: () => number): SnifferFind {
  const r = rand();
  if (r < 0.05) return 'pitcher_pod';
  if (r < 0.25) return 'torchflower_seeds';
  return null;
}

export function validSoil(blockId: string): boolean {
  return (
    blockId === 'grass_block' ||
    blockId === 'dirt' ||
    blockId === 'podzol' ||
    blockId === 'coarse_dirt' ||
    blockId === 'rooted_dirt'
  );
}
