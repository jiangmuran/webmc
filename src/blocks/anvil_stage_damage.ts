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

// Wiki (minecraft.wiki/w/Anvil): "If it falls from a height greater
// than one block, the chance of degrading by one stage is 5% × the
// number of blocks fallen." Old code deterministically advanced the
// stage by `floor(fallDistance)` — a 3-block drop always reduced an
// undamaged anvil to 'destroyed', when the wiki gives only 15%
// chance of a *single* stage advancement.
export const FALL_DAMAGE_CHANCE_PER_BLOCK = 0.05;
export function damageOnFall(s: Stage, fallDistance: number, rng: () => number): Stage {
  if (s === 'destroyed') return s;
  if (fallDistance <= 1) return s;
  const chance = Math.min(1, FALL_DAMAGE_CHANCE_PER_BLOCK * fallDistance);
  return rng() < chance ? nextStage(s) : s;
}
