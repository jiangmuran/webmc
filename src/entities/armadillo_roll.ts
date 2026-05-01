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

// Wiki (minecraft.wiki/w/Armadillo): "It unrolls if it detects no
// threats for 3 seconds (60 ticks)." Old UNCURL_DELAY_SEC = 2 was
// 1 second under wiki canon — a curled armadillo would un-roll
// before the wiki-stated 3-second safety window passed.
const ROLL_COOLDOWN_SEC = 3;
const UNCURL_DELAY_SEC = 3;

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

// Wiki (minecraft.wiki/w/Armadillo): "While rolled up, it takes a
// reduced amount of damage given by (original damage − 1) / 2."
// The formula applies UNIFORMLY to every damage type in JE; the
// only exception ('self_destruct') is BE-only. Earlier code used
// a fictional 50%-melee / 0-projectile split that was nowhere
// in the wiki — projectiles dealt full damage to a curled
// armadillo when they should be reduced too.
export const ROLLED_OFFSET = 1;
export const ROLLED_DIVISOR = 2;

export interface ArmadilloDamageQuery {
  rolled: boolean;
  incoming: number;
  source: 'melee' | 'projectile' | 'explosion' | 'fall' | 'other';
}

export function armadilloTakeDamage(q: ArmadilloDamageQuery): number {
  if (!q.rolled) return q.incoming;
  return Math.max(0, (q.incoming - ROLLED_OFFSET) / ROLLED_DIVISOR);
}
