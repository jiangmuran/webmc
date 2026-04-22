// Ender dragon phase machine. Phases: circling (idle flight around
// portal), hovering (stationary above portal), landing (approaching),
// perching (on portal), strafing (dive + fireball), charging (rush at
// player), dying.

export type DragonPhase =
  | 'circling'
  | 'hovering'
  | 'strafing'
  | 'landing_approach'
  | 'perching'
  | 'charging_player'
  | 'dying';

export interface DragonPhaseState {
  current: DragonPhase;
  timeInPhaseSec: number;
  cratesLeft: number; // crystals remaining
  health: number;
  maxHealth: number;
}

export function makeDragonPhaseState(): DragonPhaseState {
  return {
    current: 'circling',
    timeInPhaseSec: 0,
    cratesLeft: 10,
    health: 200,
    maxHealth: 200,
  };
}

export interface DragonPhaseCtx {
  dtSec: number;
  rng: () => number;
}

export function tickDragonPhases(state: DragonPhaseState, ctx: DragonPhaseCtx): void {
  state.timeInPhaseSec += ctx.dtSec;
  if (state.health <= 0) {
    state.current = 'dying';
    return;
  }
  switch (state.current) {
    case 'circling':
      if (state.timeInPhaseSec >= 20) {
        state.current = ctx.rng() < 0.5 ? 'strafing' : 'hovering';
        state.timeInPhaseSec = 0;
      }
      break;
    case 'hovering':
      if (state.timeInPhaseSec >= 5) {
        state.current = 'circling';
        state.timeInPhaseSec = 0;
      }
      break;
    case 'strafing':
      if (state.timeInPhaseSec >= 8) {
        state.current = 'circling';
        state.timeInPhaseSec = 0;
      }
      break;
    case 'landing_approach':
      if (state.timeInPhaseSec >= 3) {
        state.current = 'perching';
        state.timeInPhaseSec = 0;
      }
      break;
    case 'perching':
      if (state.timeInPhaseSec >= 15) {
        state.current = 'circling';
        state.timeInPhaseSec = 0;
      }
      break;
    case 'charging_player':
      if (state.timeInPhaseSec >= 5) {
        state.current = 'circling';
        state.timeInPhaseSec = 0;
      }
      break;
    case 'dying':
      break;
  }
  // Below 50% HP, more aggressive: enter charging more often.
  if (state.current === 'circling' && state.health < state.maxHealth / 2 && ctx.rng() < 0.2) {
    state.current = 'charging_player';
    state.timeInPhaseSec = 0;
  }
}

// Called when all crystals are destroyed — forces landing.
export function onAllCrystalsDestroyed(state: DragonPhaseState): void {
  state.cratesLeft = 0;
  state.current = 'landing_approach';
  state.timeInPhaseSec = 0;
}
