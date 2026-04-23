export type Action =
  | 'sprint'
  | 'jump'
  | 'sprintJump'
  | 'mine'
  | 'attack'
  | 'takeDamage'
  | 'swim'
  | 'regen';

export const EXHAUSTION_PER: Record<Action, number> = {
  sprint: 0.1,
  jump: 0.05,
  sprintJump: 0.2,
  mine: 0.005,
  attack: 0.1,
  takeDamage: 0.1,
  swim: 0.01,
  regen: 6,
};

export const SATURATION_CONSUMES_AT = 4;

export interface HungerState {
  exhaustion: number;
  saturation: number;
  hunger: number;
}

export function addExhaustion(s: HungerState, a: Action): HungerState {
  let exhaustion = s.exhaustion + EXHAUSTION_PER[a];
  let saturation = s.saturation;
  let hunger = s.hunger;
  while (exhaustion >= SATURATION_CONSUMES_AT) {
    exhaustion -= SATURATION_CONSUMES_AT;
    if (saturation > 0) saturation = Math.max(0, saturation - 1);
    else hunger = Math.max(0, hunger - 1);
  }
  return { exhaustion, saturation, hunger };
}
