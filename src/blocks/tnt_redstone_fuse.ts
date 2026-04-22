// TNT ignition by redstone. When placed next to a powered redstone
// source, the TNT ignites and despawns from block form to TNT entity.

export interface TntBlock {
  poweredByRedstone: boolean;
}

export const TNT_FUSE_TICKS = 80;

export type IgniteSource =
  | 'flint_and_steel'
  | 'fire_charge'
  | 'redstone'
  | 'explosion'
  | 'burning_arrow'
  | 'fire';

export interface IgniteResult {
  activated: boolean;
  fuseTicks: number;
}

export function tryIgnite(b: TntBlock, source: IgniteSource): IgniteResult {
  if (source === 'redstone') {
    if (!b.poweredByRedstone) return { activated: false, fuseTicks: 0 };
  }
  let fuse = TNT_FUSE_TICKS;
  if (source === 'explosion') fuse = 10 + Math.floor(Math.random() * 20);
  return { activated: true, fuseTicks: fuse };
}

// TNT moved by piston is not ignited.
export function pistonPushIgnites(): boolean {
  return false;
}
