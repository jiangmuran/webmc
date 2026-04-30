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

// Wiki (minecraft.wiki/w/Phantom): "Damage Java: Easy & Normal 2,
// Hard 3. Bedrock: Easy 4, Normal 6, Hard 9." webmc targets Java
// per AGENT_CHARTER, so 2 is the Easy/Normal value and the most
// representative default. Old constant 4 was the Bedrock-Easy value
// — Java phantoms hit half as hard.
export const PHANTOM_CONTACT_DAMAGE = 2;
export const PHANTOM_CONTACT_DAMAGE_HARD = 3;

export function phantomContactDamage(difficulty: 'easy' | 'normal' | 'hard'): number {
  return difficulty === 'hard' ? PHANTOM_CONTACT_DAMAGE_HARD : PHANTOM_CONTACT_DAMAGE;
}
