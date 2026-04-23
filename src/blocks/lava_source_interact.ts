export type Interaction =
  | 'obsidian'
  | 'cobblestone'
  | 'stone'
  | 'magma_block'
  | 'none';

export interface Combo {
  lavaIsSource: boolean;
  waterIsSource: boolean;
  lavaTouchesAbove: boolean;
  waterTouchesSide: boolean;
}

export function result(c: Combo): Interaction {
  if (c.lavaIsSource && c.waterTouchesSide) return 'obsidian';
  if (!c.lavaIsSource && c.waterIsSource) return 'stone';
  if (!c.lavaIsSource && !c.waterIsSource && c.lavaTouchesAbove) return 'cobblestone';
  return 'none';
}

export function emitsHissSound(c: Combo): boolean {
  return result(c) !== 'none';
}
