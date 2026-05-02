// Cave vines (glow berry producer). Vines grow downward; each segment
// has an age 0..25 and may bear berries. Berries give Saturation when
// eaten, emit light level 14, and can be picked by clicking.

export interface CaveVineSegment {
  age: number; // 0..25
  hasBerries: boolean;
  isTip: boolean; // only the tip can grow
}

export function makeVineSegment(isTip: boolean): CaveVineSegment {
  return { age: 0, hasBerries: false, isTip };
}

const MAX_AGE = 25;
const GROW_CHANCE = 0.11;
const BERRY_CHANCE = 0.11;

export interface VineTickCtx {
  belowIsAir: boolean;
  roll: number;
}

export type VineTickResult = 'grew_down' | 'sprouted_berries' | 'none';

export function tickCaveVine(state: CaveVineSegment, ctx: VineTickCtx): VineTickResult {
  if (!state.isTip) {
    // Non-tip: rarely sprouts berries.
    if (!state.hasBerries && ctx.roll < BERRY_CHANCE) {
      state.hasBerries = true;
      return 'sprouted_berries';
    }
    return 'none';
  }
  if (state.age >= MAX_AGE) return 'none';
  if (ctx.roll < GROW_CHANCE && ctx.belowIsAir) {
    state.age++;
    return 'grew_down';
  }
  if (!state.hasBerries && ctx.roll < BERRY_CHANCE) {
    state.hasBerries = true;
    return 'sprouted_berries';
  }
  return 'none';
}

// Picking berries: removes berries but keeps the vine.
//
// Wiki (minecraft.wiki/w/Glow_Berries): "A cave vine can be broken
// ... yielding one unit of glow berries if the vine is bearing
// berries... This is not affected by Fortune." And: "One unit of
// glow berries can also be collected from cave vines bearing
// berries without breaking the plant." So picking always returns
// exactly 1. Old `1 + (rng()<0.11 ? 1 : 0)` rolled an undocumented
// 11% chance at +1, an artifact of treating cave vine picking like
// sweet-berry harvest.
export interface PickResult {
  picked: boolean;
  count: number;
}

export function pickBerries(state: CaveVineSegment, rng: () => number): PickResult {
  void rng;
  if (!state.hasBerries) return { picked: false, count: 0 };
  state.hasBerries = false;
  return { picked: true, count: 1 };
}

// Bone-meal on a cave vine (non-tip or tip): if no berries, force berry
// sprout; if has berries, no effect.
export function boneMealCaveVine(state: CaveVineSegment): boolean {
  if (state.hasBerries) return false;
  state.hasBerries = true;
  return true;
}

// Light emission: 14 with berries, 0 without.
export function emission(state: CaveVineSegment): number {
  return state.hasBerries ? 14 : 0;
}

// Eating a glow berry: hunger +2, saturation +0.4.
export const GLOW_BERRY_HUNGER = 2;
export const GLOW_BERRY_SATURATION = 0.4;
