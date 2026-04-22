// Dripstone cave biome. Filled with pointed dripstone + dripstone blocks;
// aquifer pools have dripstone cones hanging from the ceiling. Water
// dripping from stalactites lands in cauldrons at 1/45 tick probability.

export interface DripstoneCaveLayout {
  stalactiteCount: number;
  stalagmiteCount: number;
  aquiferPools: number;
  cavernHeight: number;
}

export interface DripstoneCaveQuery {
  rng: () => number;
  caveVolume: number;
}

export function planDripstoneCave(q: DripstoneCaveQuery): DripstoneCaveLayout {
  const scale = q.caveVolume / 1000;
  return {
    stalactiteCount: Math.floor(15 + scale * 2),
    stalagmiteCount: Math.floor(12 + scale * 2),
    aquiferPools: Math.floor(1 + scale * 0.3 * q.rng()),
    cavernHeight: 10 + Math.floor(q.rng() * 15),
  };
}

// Stalactite fall damage: scales with how tall the stalactite is.
export function stalactiteFallDamage(length: number): number {
  return Math.max(2, length * 2);
}

// Stalactite tip "dripping" — 1/45 chance per tick to drip water/lava.
export type DripFluid = 'water' | 'lava';

export interface DripState {
  tipFluid: DripFluid;
  cauldronBelowLevels: number; // 0..3
}

const DRIP_PROB = 1 / 45;
const MAX_CAULDRON = 3;

export type DripResult = 'dripped' | 'full' | 'no_cauldron' | 'none';

export function tickDrip(state: DripState, roll: number, cauldronExists: boolean): DripResult {
  if (!cauldronExists) return 'no_cauldron';
  if (state.cauldronBelowLevels >= MAX_CAULDRON) return 'full';
  if (roll >= DRIP_PROB) return 'none';
  state.cauldronBelowLevels++;
  return 'dripped';
}

// Smashing stalagmites below yields pointed dripstone drops only if the
// player used a pickaxe (silk touch irrelevant here, it's a 100% drop).
export function stalagmiteBreakDrops(
  withPickaxe: boolean,
): { item: 'webmc:pointed_dripstone'; count: number }[] {
  if (!withPickaxe) return [];
  return [{ item: 'webmc:pointed_dripstone', count: 1 }];
}
