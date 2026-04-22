// Hunger exhaustion. Every action adds exhaustion; when exhaustion
// passes 4.0, one saturation is consumed (or hunger if saturation is 0).
// Exhaustion values from MC:
//   sprinting: 0.1 per block
//   jumping: 0.05 per jump, 0.2 if sprint-jumping
//   mining: 0.005 per block
//   attack: 0.1 per swing
//   damage taken: 0.1 per damage event
//   regeneration: 6.0 per restored HP

export type ExhaustionAction =
  | { kind: 'sprint'; blocks: number }
  | { kind: 'walk'; blocks: number }
  | { kind: 'jump' }
  | { kind: 'sprint_jump' }
  | { kind: 'swim'; blocks: number }
  | { kind: 'mine' }
  | { kind: 'attack' }
  | { kind: 'damage' }
  | { kind: 'heal_tick'; hpRestored: number };

const VALUES = {
  sprint: 0.1,
  walk: 0.0,
  jump: 0.05,
  sprint_jump: 0.2,
  swim: 0.01,
  mine: 0.005,
  attack: 0.1,
  damage: 0.1,
  heal_per_hp: 6.0,
};

export function actionExhaustion(a: ExhaustionAction): number {
  switch (a.kind) {
    case 'sprint':
      return a.blocks * VALUES.sprint;
    case 'walk':
      return a.blocks * VALUES.walk;
    case 'jump':
      return VALUES.jump;
    case 'sprint_jump':
      return VALUES.sprint_jump;
    case 'swim':
      return a.blocks * VALUES.swim;
    case 'mine':
      return VALUES.mine;
    case 'attack':
      return VALUES.attack;
    case 'damage':
      return VALUES.damage;
    case 'heal_tick':
      return a.hpRestored * VALUES.heal_per_hp;
  }
}

const EXHAUSTION_THRESHOLD = 4.0;

export interface HungerCounters {
  exhaustion: number; // 0..4
  saturation: number;
  hunger: number;
}

export interface ApplyResult {
  saturationSpent: number;
  hungerSpent: number;
}

export function applyExhaustion(state: HungerCounters, action: ExhaustionAction): ApplyResult {
  state.exhaustion += actionExhaustion(action);
  let satSpent = 0;
  let hungerSpent = 0;
  while (state.exhaustion >= EXHAUSTION_THRESHOLD) {
    state.exhaustion -= EXHAUSTION_THRESHOLD;
    if (state.saturation > 0) {
      const take = Math.min(state.saturation, 1);
      state.saturation -= take;
      satSpent += take;
    } else if (state.hunger > 0) {
      state.hunger -= 1;
      hungerSpent += 1;
    } else {
      state.exhaustion = 0;
      break;
    }
  }
  return { saturationSpent: satSpent, hungerSpent };
}
