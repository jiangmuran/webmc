// Camel dash. When ridden, tapping the jump button triggers a forward
// leap (~12 blocks horizontal, ~1.5 blocks vertical). A 55-tick cooldown
// gates repeat dashes. Camels also have a "sitting" pose that takes ~4
// ticks to stand up from.

export interface CamelState {
  sitting: boolean;
  dashCooldownTicks: number;
  standingAnimTicks: number; // ticking up from 0 to 4 when rising
}

export function makeCamel(): CamelState {
  return { sitting: false, dashCooldownTicks: 0, standingAnimTicks: 0 };
}

const DASH_COOLDOWN_TICKS = 55;

export interface DashAttempt {
  jumpPressed: boolean;
  riding: boolean;
}

export interface DashResult {
  dashed: boolean;
  horizontalBoost: number;
  verticalBoost: number;
}

export function tryDash(state: CamelState, q: DashAttempt): DashResult {
  if (!q.riding || !q.jumpPressed || state.sitting || state.dashCooldownTicks > 0) {
    return { dashed: false, horizontalBoost: 0, verticalBoost: 0 };
  }
  state.dashCooldownTicks = DASH_COOLDOWN_TICKS;
  return { dashed: true, horizontalBoost: 1.6, verticalBoost: 0.6 };
}

export function tickCamel(state: CamelState): void {
  if (state.dashCooldownTicks > 0) state.dashCooldownTicks--;
  if (state.standingAnimTicks > 0 && state.standingAnimTicks < 4) state.standingAnimTicks++;
}

export function sit(state: CamelState): boolean {
  if (state.sitting) return false;
  state.sitting = true;
  state.standingAnimTicks = 0;
  return true;
}

export function stand(state: CamelState): boolean {
  if (!state.sitting) return false;
  state.sitting = false;
  state.standingAnimTicks = 1;
  return true;
}

// Two riders possible: camel has 2 saddle seats.
export const CAMEL_MAX_PASSENGERS = 2;

export function canMount(state: CamelState, currentPassengers: number): boolean {
  return !state.sitting && currentPassengers < CAMEL_MAX_PASSENGERS;
}
