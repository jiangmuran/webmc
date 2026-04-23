// Raid wave composition by difficulty.

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface Wave {
  pillager: number;
  vindicator: number;
  evoker: number;
  witch: number;
  ravager: number;
}

export const WAVES_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 3,
  normal: 5,
  hard: 7,
};

export function makeWave(index: number, difficulty: Difficulty): Wave {
  const easy = difficulty === 'easy';
  const hard = difficulty === 'hard';
  const base: Wave = {
    pillager: Math.max(0, 2 + index),
    vindicator: Math.max(0, index - 1),
    evoker: 0,
    witch: 0,
    ravager: 0,
  };
  if (index >= 3) base.evoker = 1;
  if (index >= 4) base.witch = 1;
  if (index >= 5) base.ravager = 1;
  if (easy) {
    base.pillager = Math.max(1, base.pillager - 1);
    base.ravager = Math.max(0, base.ravager - 1);
  }
  if (hard) {
    base.vindicator += 1;
    base.ravager = Math.min(2, base.ravager + 1);
  }
  return base;
}

export function totalRaiders(w: Wave): number {
  return w.pillager + w.vindicator + w.evoker + w.witch + w.ravager;
}
