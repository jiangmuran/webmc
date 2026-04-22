// Hunger exhaustion from actions. When the exhaustion accumulator
// hits 4, saturation or hunger decrements. This module is a purely
// functional accumulator.

export interface HungerAction {
  kind:
    | 'sprint_block'
    | 'walk_block'
    | 'swim_block'
    | 'jump'
    | 'sprint_jump'
    | 'attack'
    | 'block_break'
    | 'damage_taken'
    | 'heal_1hp';
}

const COST: Record<HungerAction['kind'], number> = {
  sprint_block: 0.1,
  walk_block: 0,
  swim_block: 0.01,
  jump: 0.05,
  sprint_jump: 0.2,
  attack: 0.1,
  block_break: 0.005,
  damage_taken: 0.1,
  heal_1hp: 6,
};

export const EXHAUSTION_ROLLOVER = 4;

export interface HungerPools {
  exhaustion: number;
  saturation: number;
  hunger: number;
}

export function applyAction(p: HungerPools, a: HungerAction): void {
  p.exhaustion += COST[a.kind];
  while (p.exhaustion >= EXHAUSTION_ROLLOVER) {
    p.exhaustion -= EXHAUSTION_ROLLOVER;
    if (p.saturation > 0) {
      p.saturation = Math.max(0, p.saturation - 1);
    } else if (p.hunger > 0) {
      p.hunger = Math.max(0, p.hunger - 1);
    }
  }
}

export function costOf(a: HungerAction): number {
  return COST[a.kind];
}
