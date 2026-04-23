export type Stage = 'anvil' | 'chipped_anvil' | 'damaged_anvil' | 'destroyed';

export const DAMAGE_CHANCE_PER_USE = 0.12;

export function nextStage(s: Stage): Stage {
  if (s === 'anvil') return 'chipped_anvil';
  if (s === 'chipped_anvil') return 'damaged_anvil';
  return 'destroyed';
}

export function damageOnUse(s: Stage, rng: () => number): Stage {
  if (s === 'destroyed') return s;
  return rng() < DAMAGE_CHANCE_PER_USE ? nextStage(s) : s;
}

export function damageOnFall(s: Stage, fallDistance: number): Stage {
  if (s === 'destroyed') return s;
  if (fallDistance < 1) return s;
  let out = s;
  for (let i = 0; i < Math.floor(fallDistance); i++) out = nextStage(out);
  return out;
}
