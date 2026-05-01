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

export function tryIgnite(
  b: TntBlock,
  source: IgniteSource,
  rng: () => number = Math.random,
): IgniteResult {
  if (source === 'redstone') {
    if (!b.poweredByRedstone) return { activated: false, fuseTicks: 0 };
  }
  let fuse = TNT_FUSE_TICKS;
  // Wiki (minecraft.wiki/w/TNT): "If TNT is ignited by another
  // explosion, the fuse is randomized between 10 and 30 ticks
  // (0.5–1.5 seconds)." Sibling tnt_prime.ts uses the same span.
  if (source === 'explosion') fuse = 10 + Math.floor(rng() * 21);
  return { activated: true, fuseTicks: fuse };
}

// TNT moved by piston is not ignited.
export function pistonPushIgnites(): boolean {
  return false;
}
