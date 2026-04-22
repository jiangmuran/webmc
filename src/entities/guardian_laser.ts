// Guardian laser. Charges for 4 seconds, then deals 6-12 HP based on
// difficulty. Aiming breaks if the target moves out of line of sight.

export interface GuardianLaserState {
  chargingSec: number;
  cooldownSec: number;
  targetId: number | null;
}

const CHARGE_DURATION = 4;
const COOLDOWN_SEC = 3;

export function makeGuardianLaser(): GuardianLaserState {
  return { chargingSec: 0, cooldownSec: 0, targetId: null };
}

export interface GuardianTickCtx {
  dtSec: number;
  targetId: number | null;
  lineOfSight: boolean;
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
}

export interface GuardianTickResult {
  fired: boolean;
  damage: number;
  currentTargetId: number | null;
  chargingProgress: number; // 0..1
}

const DAMAGE_BY_DIFFICULTY = { peaceful: 0, easy: 6, normal: 8, hard: 12 };

export function tickGuardian(state: GuardianLaserState, ctx: GuardianTickCtx): GuardianTickResult {
  state.cooldownSec = Math.max(0, state.cooldownSec - ctx.dtSec);
  if (state.cooldownSec > 0 || ctx.targetId === null || !ctx.lineOfSight) {
    state.chargingSec = 0;
    state.targetId = ctx.targetId;
    return { fired: false, damage: 0, currentTargetId: ctx.targetId, chargingProgress: 0 };
  }
  state.targetId = ctx.targetId;
  state.chargingSec += ctx.dtSec;
  if (state.chargingSec < CHARGE_DURATION) {
    return {
      fired: false,
      damage: 0,
      currentTargetId: ctx.targetId,
      chargingProgress: state.chargingSec / CHARGE_DURATION,
    };
  }
  state.chargingSec = 0;
  state.cooldownSec = COOLDOWN_SEC;
  return {
    fired: true,
    damage: DAMAGE_BY_DIFFICULTY[ctx.difficulty],
    currentTargetId: ctx.targetId,
    chargingProgress: 1,
  };
}
