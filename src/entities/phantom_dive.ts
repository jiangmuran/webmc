// Phantom flight + dive attack. Flies around above the player until
// within attack range, then dives for ~3 seconds dealing 4 HP on contact.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type PhantomPhase = 'circling' | 'swooping' | 'retreating';

export interface PhantomState {
  phase: PhantomPhase;
  phaseSec: number;
}

const SWOOP_DURATION = 3;
const RETREAT_DURATION = 2;

export function makePhantomState(): PhantomState {
  return { phase: 'circling', phaseSec: 0 };
}

export interface PhantomTickCtx {
  dtSec: number;
  distanceToPlayer: number;
  isDay: boolean;
}

export interface PhantomTickResult {
  dealsContactDamage: boolean;
  takesSunDamage: boolean;
}

export function tickPhantom(state: PhantomState, ctx: PhantomTickCtx): PhantomTickResult {
  state.phaseSec += ctx.dtSec;
  switch (state.phase) {
    case 'circling':
      if (ctx.distanceToPlayer < 20 && state.phaseSec > 2) {
        state.phase = 'swooping';
        state.phaseSec = 0;
      }
      break;
    case 'swooping':
      if (state.phaseSec >= SWOOP_DURATION) {
        state.phase = 'retreating';
        state.phaseSec = 0;
      }
      break;
    case 'retreating':
      if (state.phaseSec >= RETREAT_DURATION) {
        state.phase = 'circling';
        state.phaseSec = 0;
      }
      break;
  }
  return {
    dealsContactDamage: state.phase === 'swooping' && ctx.distanceToPlayer < 2,
    takesSunDamage: ctx.isDay,
  };
}

export const PHANTOM_CONTACT_DAMAGE = 4;
