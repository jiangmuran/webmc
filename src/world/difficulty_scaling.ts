// Difficulty: peaceful / easy / normal / hard. Affects damage, regen,
// hunger, mob behavior.

export type Difficulty = 'peaceful' | 'easy' | 'normal' | 'hard';

export function allowsHostileMobs(d: Difficulty): boolean {
  return d !== 'peaceful';
}

export function hungerStarvationDamage(d: Difficulty): number {
  if (d === 'peaceful') return 0;
  if (d === 'easy') return 1;
  if (d === 'normal') return 2;
  return 2;
}

export function naturalRegenInterval(d: Difficulty): number {
  // Regen 1 HP every N ticks when fully fed (simplified).
  if (d === 'peaceful') return 20;
  if (d === 'easy') return 40;
  if (d === 'normal') return 80;
  return 160;
}

export function mobDamageMultiplier(d: Difficulty): number {
  if (d === 'peaceful') return 0;
  if (d === 'easy') return 0.75;
  if (d === 'normal') return 1;
  return 1.5;
}
