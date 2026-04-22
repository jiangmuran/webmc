// Armadillo roll-up behavior. When threatened (nearby hostile mob, player
// sprint, damage recently taken), the armadillo curls into a ball that
// can't be hurt by most melee; it stays curled until threats are gone.

export interface ArmadilloRollState {
  rolled: boolean;
  rollCooldownSec: number;
  uncurlDelaySec: number;
}

export function makeArmadilloRollState(): ArmadilloRollState {
  return { rolled: false, rollCooldownSec: 0, uncurlDelaySec: 0 };
}

const ROLL_COOLDOWN_SEC = 3;
const UNCURL_DELAY_SEC = 2;

export interface ThreatContext {
  nearbyHostile: boolean;
  recentlyDamaged: boolean;
  playerSprintingNearby: boolean;
  dtSec: number;
}

export interface ArmadilloRollResult {
  stateChanged: boolean;
}

export function tickArmadilloRoll(
  state: ArmadilloRollState,
  ctx: ThreatContext,
): ArmadilloRollResult {
  state.rollCooldownSec = Math.max(0, state.rollCooldownSec - ctx.dtSec);
  const threatened = ctx.nearbyHostile || ctx.recentlyDamaged || ctx.playerSprintingNearby;
  if (state.rolled) {
    if (!threatened) {
      state.uncurlDelaySec += ctx.dtSec;
      if (state.uncurlDelaySec >= UNCURL_DELAY_SEC) {
        state.rolled = false;
        state.uncurlDelaySec = 0;
        return { stateChanged: true };
      }
    } else {
      state.uncurlDelaySec = 0;
    }
    return { stateChanged: false };
  }
  if (threatened && state.rollCooldownSec === 0) {
    state.rolled = true;
    state.rollCooldownSec = ROLL_COOLDOWN_SEC;
    return { stateChanged: true };
  }
  return { stateChanged: false };
}

// Damage handling: rolled armadillo takes 0 damage from melee; projectiles
// still hurt (wind_charge, arrows). Returns the final damage to apply.
export interface ArmadilloDamageQuery {
  rolled: boolean;
  incoming: number;
  source: 'melee' | 'projectile' | 'explosion' | 'fall' | 'other';
}

export function armadilloTakeDamage(q: ArmadilloDamageQuery): number {
  if (!q.rolled) return q.incoming;
  if (q.source === 'melee') return 0;
  return q.incoming;
}
