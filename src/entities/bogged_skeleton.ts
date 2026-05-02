// Bogged: mossy skeleton variant. Shoots tipped arrows of Poison.
// Slower fire rate than skeleton. Shearing drops 2 mushrooms and
// converts the bogged to a regular skeleton.
//
// Wiki (minecraft.wiki/w/Bogged):
//   Arrow of Poison: Poison for 4 seconds (80 ticks), 3 damage.
//   Cooldown: 3.5s (70 ticks) Easy/Normal; 2.5s (50 ticks) Hard.
//
// Old BOGGED_POISON_DURATION_TICKS = 140 (7s) was 75% over wiki.
// BOGGED_DRAW_COOLDOWN_TICKS = 50 was the Hard-difficulty value
// hardcoded as the only constant; sibling bogged.ts uses 70
// (Normal). Now exposed as a difficulty-aware function and the
// default constant matches Normal so the two siblings agree.

export type Difficulty = 'easy' | 'normal' | 'hard';

export const BOGGED_DRAW_COOLDOWN_NORMAL_TICKS = 70;
export const BOGGED_DRAW_COOLDOWN_HARD_TICKS = 50;
// Default constant points at Normal so it matches sibling bogged.ts
// (DRAW_TICKS_REQUIRED = 70). Older callers using the constant
// directly get the wiki Easy/Normal value, not the harder one.
export const BOGGED_DRAW_COOLDOWN_TICKS = BOGGED_DRAW_COOLDOWN_NORMAL_TICKS;
export const BOGGED_POISON_DURATION_TICKS = 80; // 4s
export const BOGGED_MAX_HEALTH = 16;

export function drawCooldownTicks(difficulty: Difficulty): number {
  return difficulty === 'hard'
    ? BOGGED_DRAW_COOLDOWN_HARD_TICKS
    : BOGGED_DRAW_COOLDOWN_NORMAL_TICKS;
}

export interface BoggedShot {
  arrowType: 'tipped_poison';
  poisonDurationTicks: number;
  cooldownTicks: number;
}

export function nextShot(difficulty: Difficulty = 'normal'): BoggedShot {
  return {
    arrowType: 'tipped_poison',
    poisonDurationTicks: BOGGED_POISON_DURATION_TICKS,
    cooldownTicks: drawCooldownTicks(difficulty),
  };
}

export interface ShearResult {
  becomesSkeleton: boolean;
  mushroomsDropped: number;
}

export function shear(): ShearResult {
  return { becomesSkeleton: true, mushroomsDropped: 2 };
}
