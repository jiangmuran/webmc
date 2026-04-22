// Shield disabling. An axe hit (regular or charged) disables the
// player's shield for 5 seconds. Disabled shields can't block damage and
// can't be raised again until the timer expires.

export interface ShieldDisableQuery {
  attackerWeapon: 'axe' | 'sword' | 'trident' | 'mace' | 'fist' | 'other';
  attackerSprintingOrCharged: boolean;
  shieldWasRaised: boolean;
}

export const SHIELD_DISABLE_SEC = 5;

export interface ShieldDisableResult {
  disabled: boolean;
  durationSec: number;
}

// Axe hits always disable when shield is raised; charged axe hits
// disable even against a lowered shield (MC 1.14+).
export function shieldDisableCheck(q: ShieldDisableQuery): ShieldDisableResult {
  if (q.attackerWeapon !== 'axe') return { disabled: false, durationSec: 0 };
  if (!q.shieldWasRaised && !q.attackerSprintingOrCharged) {
    return { disabled: false, durationSec: 0 };
  }
  return { disabled: true, durationSec: SHIELD_DISABLE_SEC };
}

// Shield raising: while holding right-click, mitigation is applied. An
// "activation delay" of 5 ticks prevents instant on-raise blocking.
export const SHIELD_RAISE_ACTIVATION_TICKS = 5;

export interface ShieldRaiseState {
  holdingSecondary: boolean;
  raiseTicks: number;
  disabledUntilTicks: number; // game tick timestamp
}

export interface ShieldTickCtx {
  nowTicks: number;
  secondaryHeld: boolean;
}

export function tickShieldRaise(state: ShieldRaiseState, ctx: ShieldTickCtx): boolean {
  if (ctx.nowTicks < state.disabledUntilTicks) {
    state.raiseTicks = 0;
    return false;
  }
  if (ctx.secondaryHeld) {
    state.raiseTicks++;
  } else {
    state.raiseTicks = 0;
  }
  return state.raiseTicks >= SHIELD_RAISE_ACTIVATION_TICKS;
}

export function disableShieldAt(
  state: ShieldRaiseState,
  nowTicks: number,
  durationSec: number,
): void {
  state.disabledUntilTicks = nowTicks + Math.round(durationSec * 20);
  state.raiseTicks = 0;
}
