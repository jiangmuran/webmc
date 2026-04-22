// Eating animation. Right-click a food item to start eating; the
// animation lasts ~1.6s (32 ticks). Partway through, ~8 particles of
// the food texture spawn near the mouth. On completion, hunger/
// saturation/effects apply and the item is consumed.

export interface EatState {
  itemId: string | null;
  ticksRemaining: number;
  totalTicks: number;
  particlesSpawnedCount: number;
}

export function makeEatState(): EatState {
  return {
    itemId: null,
    ticksRemaining: 0,
    totalTicks: 0,
    particlesSpawnedCount: 0,
  };
}

const DEFAULT_TOTAL_TICKS = 32; // 1.6s
const MAX_PARTICLES = 8;

export interface StartEatQuery {
  itemId: string;
  eatTicks?: number; // some items override (dried kelp is faster)
}

export function startEating(state: EatState, q: StartEatQuery): boolean {
  if (state.itemId !== null) return false;
  state.itemId = q.itemId;
  state.totalTicks = q.eatTicks ?? DEFAULT_TOTAL_TICKS;
  state.ticksRemaining = state.totalTicks;
  state.particlesSpawnedCount = 0;
  return true;
}

export interface EatTickResult {
  completed: boolean;
  itemConsumed: string | null;
  particlesSpawnedThisTick: number;
}

export function tickEating(state: EatState): EatTickResult {
  if (state.itemId === null) {
    return { completed: false, itemConsumed: null, particlesSpawnedThisTick: 0 };
  }
  state.ticksRemaining--;
  const ticksElapsed = state.totalTicks - state.ticksRemaining;
  const targetParticles = Math.min(
    MAX_PARTICLES,
    Math.floor((ticksElapsed / state.totalTicks) * MAX_PARTICLES),
  );
  const spawned = targetParticles - state.particlesSpawnedCount;
  state.particlesSpawnedCount = targetParticles;
  if (state.ticksRemaining <= 0) {
    const consumed = state.itemId;
    state.itemId = null;
    state.ticksRemaining = 0;
    state.totalTicks = 0;
    state.particlesSpawnedCount = 0;
    return {
      completed: true,
      itemConsumed: consumed,
      particlesSpawnedThisTick: spawned,
    };
  }
  return {
    completed: false,
    itemConsumed: null,
    particlesSpawnedThisTick: spawned,
  };
}

// Cancel eating (release right-click, sprint, damage).
export function cancelEating(state: EatState): boolean {
  if (state.itemId === null) return false;
  state.itemId = null;
  state.ticksRemaining = 0;
  state.totalTicks = 0;
  state.particlesSpawnedCount = 0;
  return true;
}

// Progress 0..1 for rendering the "food getting smaller" effect on the
// held model.
export function eatProgress(state: EatState): number {
  if (state.itemId === null || state.totalTicks === 0) return 0;
  return 1 - state.ticksRemaining / state.totalTicks;
}
