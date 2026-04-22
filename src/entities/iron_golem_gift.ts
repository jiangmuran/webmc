// Iron golems offer poppies to villagers. A golem sometimes holds a
// poppy; when a villager is within 3 blocks, the golem presents it and
// the villager may "accept" (a purely cosmetic event with ~1% gossip
// bump for the nearest player who built this golem).

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface GiftState {
  holdingPoppy: boolean;
  presentingToId: number | null;
  ticksPresenting: number;
  ticksUntilNextAttempt: number;
}

export function makeGiftState(): GiftState {
  return {
    holdingPoppy: false,
    presentingToId: null,
    ticksPresenting: 0,
    ticksUntilNextAttempt: 0,
  };
}

const PRESENT_DISTANCE = 3;
const PRESENT_DURATION_TICKS = 40;
const ATTEMPT_COOLDOWN_TICKS = 1200;

export interface GiftTickCtx {
  golemPos: Vec3;
  nearestVillager: { id: number; pos: Vec3 } | null;
  villagerOccupied: boolean; // villager can't accept if mid-trade
  rng: () => number;
}

export interface GiftTickResult {
  startedPresenting: boolean;
  completedGift: boolean;
  dropped: boolean;
}

export function tickGift(state: GiftState, ctx: GiftTickCtx): GiftTickResult {
  if (state.ticksUntilNextAttempt > 0) state.ticksUntilNextAttempt--;
  if (state.presentingToId !== null) {
    state.ticksPresenting++;
    if (state.ticksPresenting >= PRESENT_DURATION_TICKS) {
      state.presentingToId = null;
      state.ticksPresenting = 0;
      state.holdingPoppy = false;
      state.ticksUntilNextAttempt = ATTEMPT_COOLDOWN_TICKS;
      return { startedPresenting: false, completedGift: true, dropped: false };
    }
    return { startedPresenting: false, completedGift: false, dropped: false };
  }
  if (!state.holdingPoppy) {
    if (state.ticksUntilNextAttempt === 0 && ctx.rng() < 1 / 400) {
      state.holdingPoppy = true;
    }
    return { startedPresenting: false, completedGift: false, dropped: false };
  }
  if (!ctx.nearestVillager) {
    return { startedPresenting: false, completedGift: false, dropped: false };
  }
  const dx = ctx.nearestVillager.pos.x - ctx.golemPos.x;
  const dy = ctx.nearestVillager.pos.y - ctx.golemPos.y;
  const dz = ctx.nearestVillager.pos.z - ctx.golemPos.z;
  const dist = Math.hypot(dx, dy, dz);
  if (dist > PRESENT_DISTANCE) {
    return { startedPresenting: false, completedGift: false, dropped: false };
  }
  if (ctx.villagerOccupied) {
    return { startedPresenting: false, completedGift: false, dropped: false };
  }
  state.presentingToId = ctx.nearestVillager.id;
  state.ticksPresenting = 0;
  return { startedPresenting: true, completedGift: false, dropped: false };
}

// Attacking a golem cancels gift and may cause the golem to drop the
// poppy on the ground.
export function interrupt(state: GiftState): boolean {
  if (!state.holdingPoppy) return false;
  state.holdingPoppy = false;
  state.presentingToId = null;
  state.ticksPresenting = 0;
  state.ticksUntilNextAttempt = ATTEMPT_COOLDOWN_TICKS;
  return true;
}
