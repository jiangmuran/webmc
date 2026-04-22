// Wandering trader night-time invisibility. Drinks a potion of
// invisibility at sunset to hide, drinks milk to re-appear at sunrise.

export interface TraderState {
  invisible: boolean;
  potionCooldownSec: number;
}

export function makeTraderState(): TraderState {
  return { invisible: false, potionCooldownSec: 0 };
}

export interface TraderTickCtx {
  timeOfDay: number; // 0..24000
  dtSec: number;
}

export interface TraderDecision {
  drinksInvisibility: boolean;
  drinksMilk: boolean;
}

export function tickTrader(state: TraderState, ctx: TraderTickCtx): TraderDecision {
  state.potionCooldownSec = Math.max(0, state.potionCooldownSec - ctx.dtSec);
  const isNight = ctx.timeOfDay >= 12542 && ctx.timeOfDay <= 23459;
  if (isNight && !state.invisible && state.potionCooldownSec === 0) {
    state.invisible = true;
    state.potionCooldownSec = 5;
    return { drinksInvisibility: true, drinksMilk: false };
  }
  if (!isNight && state.invisible && state.potionCooldownSec === 0) {
    state.invisible = false;
    state.potionCooldownSec = 5;
    return { drinksInvisibility: false, drinksMilk: true };
  }
  return { drinksInvisibility: false, drinksMilk: false };
}
