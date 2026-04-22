// Frog mob (1.19). Three variants by biome: temperate (green), warm
// (orange), cold (white). Frogs eat small slimes and magma cubes; eating
// a magma cube drops pearlescent / verdant / ochre froglight respectively.

export type FrogVariant = 'temperate' | 'warm' | 'cold';

export const FROG_BY_BIOME: Record<string, FrogVariant> = {
  swamp: 'temperate',
  forest: 'temperate',
  plains: 'temperate',
  mangrove_swamp: 'warm',
  jungle: 'warm',
  desert: 'warm',
  snowy_plains: 'cold',
  snowy_taiga: 'cold',
};

export function frogVariantFor(biome: string): FrogVariant {
  return FROG_BY_BIOME[biome] ?? 'temperate';
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type FrogStance = 'idle' | 'hopping' | 'tongue_out' | 'eating' | 'dead';

export interface FrogState {
  id: number;
  variant: FrogVariant;
  position: Vec3;
  stance: FrogStance;
  health: number;
  tongueCooldownSec: number;
}

export const FROG_MAX_HEALTH = 10;
const TONGUE_COOLDOWN_SEC = 2;
const TONGUE_RANGE = 10;

export function makeFrog(id: number, variant: FrogVariant, at: Vec3): FrogState {
  return {
    id,
    variant,
    position: { ...at },
    stance: 'idle',
    health: FROG_MAX_HEALTH,
    tongueCooldownSec: 0,
  };
}

export interface FrogTickCtx {
  nearestPrey: { id: number; kind: 'slime' | 'magma_cube'; position: Vec3 } | null;
  dtSec: number;
}

export interface FrogTickResult {
  tongueAt: number | null; // target id
  magmaEatenVariant: FrogVariant | null;
}

export function tickFrog(state: FrogState, ctx: FrogTickCtx): FrogTickResult {
  if (state.stance === 'dead') return { tongueAt: null, magmaEatenVariant: null };
  state.tongueCooldownSec = Math.max(0, state.tongueCooldownSec - ctx.dtSec);
  if (!ctx.nearestPrey) {
    state.stance = 'idle';
    return { tongueAt: null, magmaEatenVariant: null };
  }
  const dx = ctx.nearestPrey.position.x - state.position.x;
  const dy = ctx.nearestPrey.position.y - state.position.y;
  const dz = ctx.nearestPrey.position.z - state.position.z;
  const dist = Math.hypot(dx, dy, dz);
  if (dist > TONGUE_RANGE || state.tongueCooldownSec > 0) {
    state.stance = 'hopping';
    return { tongueAt: null, magmaEatenVariant: null };
  }
  state.stance = 'tongue_out';
  state.tongueCooldownSec = TONGUE_COOLDOWN_SEC;
  const magmaEaten = ctx.nearestPrey.kind === 'magma_cube' ? state.variant : null;
  return { tongueAt: ctx.nearestPrey.id, magmaEatenVariant: magmaEaten };
}

export function magmaDropFor(variant: FrogVariant): string {
  switch (variant) {
    case 'temperate':
      return 'webmc:ochre_froglight';
    case 'warm':
      return 'webmc:pearlescent_froglight';
    case 'cold':
      return 'webmc:verdant_froglight';
  }
}
