// Tadpole. Baby frog; needs to be in water; cannot breathe on land. Grows
// into a frog of the variant determined by the biome it matures in (not
// where it hatched).

import { frogVariantFor, type FrogVariant } from './frog';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface TadpoleState {
  id: number;
  position: Vec3;
  growTicks: number;
  health: number;
  secondsOutOfWater: number;
  maturedIntoVariant: FrogVariant | null;
}

const TADPOLE_GROW_TICKS = 24000; // 20 MC minutes
const OUT_OF_WATER_LETHAL_SEC = 5; // much shorter than fish
const TADPOLE_MAX_HEALTH = 6;

export function makeTadpole(id: number, at: Vec3): TadpoleState {
  return {
    id,
    position: { ...at },
    growTicks: 0,
    health: TADPOLE_MAX_HEALTH,
    secondsOutOfWater: 0,
    maturedIntoVariant: null,
  };
}

export interface TadpoleTickCtx {
  inWater: boolean;
  currentBiome: string;
  dtSec: number;
  dtTicks: number;
}

export interface TadpoleTickResult {
  died: boolean;
  matured: boolean;
  variantOnMaturation: FrogVariant | null;
}

export function tickTadpole(state: TadpoleState, ctx: TadpoleTickCtx): TadpoleTickResult {
  if (state.health <= 0) return { died: true, matured: false, variantOnMaturation: null };

  if (!ctx.inWater) {
    state.secondsOutOfWater += ctx.dtSec;
    if (state.secondsOutOfWater >= OUT_OF_WATER_LETHAL_SEC) {
      state.health = 0;
      return { died: true, matured: false, variantOnMaturation: null };
    }
    return { died: false, matured: false, variantOnMaturation: null };
  }

  state.secondsOutOfWater = 0;
  state.growTicks += ctx.dtTicks;
  if (state.growTicks >= TADPOLE_GROW_TICKS) {
    const variant = frogVariantFor(ctx.currentBiome);
    state.maturedIntoVariant = variant;
    return { died: false, matured: true, variantOnMaturation: variant };
  }
  return { died: false, matured: false, variantOnMaturation: null };
}

// Bucketing a tadpole: puts it in the player's bucket; position is reset
// on release back to wherever the player places the bucket.
export interface Bucketed {
  tadpoleId: number;
  ageWhenBucketed: number;
}

export function bucketTadpole(state: TadpoleState): Bucketed {
  return { tadpoleId: state.id, ageWhenBucketed: state.growTicks };
}
