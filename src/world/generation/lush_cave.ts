// Lush cave biome. Generated under Azalea trees; filled with moss, glow
// berries, spore blossoms, dripleaves, and axolotls in underground water
// pockets.

export interface LushCaveLayout {
  floorMossCoverage: number; // 0..1
  azaleaClusters: number;
  sporeBlossomCount: number;
  glowBerryVineCount: number;
  dripleafCount: number;
  clayPoolCount: number;
}

export interface LushCaveQuery {
  rng: () => number;
  caveVolume: number; // blocks³
}

export function planLushCave(q: LushCaveQuery): LushCaveLayout {
  const scale = q.caveVolume / 1000;
  return {
    floorMossCoverage: 0.6 + q.rng() * 0.3,
    azaleaClusters: Math.floor(1 + scale * 0.3 * q.rng()),
    sporeBlossomCount: Math.floor(2 + scale * 0.5),
    glowBerryVineCount: Math.floor(3 + scale * 0.7),
    dripleafCount: Math.floor(scale * 0.5),
    clayPoolCount: Math.floor(1 + scale * 0.2),
  };
}

// Glow berry vine: grows downward like kelp, produces berries at random
// ticks with a per-tick probability of 1/5.
export interface GlowBerryState {
  age: number; // 0..25 (length below origin)
  hasBerries: boolean;
}

export function makeGlowBerry(): GlowBerryState {
  return { age: 0, hasBerries: false };
}

const GLOW_BERRY_MAX_LENGTH = 25;

export interface GlowBerryTickCtx {
  belowIsReplaceable: boolean;
  randomRoll: number;
}

export type GlowBerryTickResult = 'grew_down' | 'bloomed' | 'none';

export function tickGlowBerry(state: GlowBerryState, ctx: GlowBerryTickCtx): GlowBerryTickResult {
  if (state.age < GLOW_BERRY_MAX_LENGTH && ctx.belowIsReplaceable && ctx.randomRoll < 0.15) {
    state.age++;
    return 'grew_down';
  }
  if (!state.hasBerries && ctx.randomRoll < 0.2) {
    state.hasBerries = true;
    return 'bloomed';
  }
  return 'none';
}

export function pickGlowBerry(state: GlowBerryState): number {
  if (!state.hasBerries) return 0;
  state.hasBerries = false;
  return 1 + Math.floor(Math.random() * 3);
}

// Spore blossoms emit particles in a 14-block radius.
export const SPORE_BLOSSOM_RADIUS = 14;
