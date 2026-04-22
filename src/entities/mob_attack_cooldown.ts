// Mob attack cooldown. Each mob has an attack-speed attribute (attacks
// per second). After an attack, they can't attack again until 1/speed
// seconds have passed. This module centralizes the timer so mobs share
// a single implementation.

export interface AttackCooldownState {
  secondsRemaining: number;
}

export function makeAttackCooldown(): AttackCooldownState {
  return { secondsRemaining: 0 };
}

export interface AttackAttemptCtx {
  attackSpeedPerSec: number;
  dtSec: number;
}

export interface AttackAttemptResult {
  canAttack: boolean;
  cooldownSec: number;
}

export function tickAttackCooldown(
  state: AttackCooldownState,
  ctx: AttackAttemptCtx,
): AttackAttemptResult {
  state.secondsRemaining = Math.max(0, state.secondsRemaining - ctx.dtSec);
  return { canAttack: state.secondsRemaining <= 0, cooldownSec: state.secondsRemaining };
}

export function triggerAttack(state: AttackCooldownState, attackSpeedPerSec: number): void {
  if (attackSpeedPerSec <= 0) {
    state.secondsRemaining = Infinity;
    return;
  }
  state.secondsRemaining = 1 / attackSpeedPerSec;
}

// Common attack-speed values for known mobs.
const ATTACK_SPEED_TABLE: Record<string, number> = {
  zombie: 1.0,
  skeleton: 1.0,
  creeper: 1.0,
  spider: 1.0,
  wolf: 1.0,
  iron_golem: 1.0,
  vindicator: 1.0,
  ravager: 0.5,
  piglin: 1.0,
  piglin_brute: 1.0,
  hoglin: 1.0,
  warden: 1.0,
  breeze: 0.67, // shots 1.5s apart
};

export function attackSpeedOf(mob: string): number {
  return ATTACK_SPEED_TABLE[mob] ?? 1.0;
}
