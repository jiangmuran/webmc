export interface SpawnCtx {
  mob: string;
  skyLight: number;
  blockLight: number;
  biome: string;
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
  hasSolidBelow: boolean;
}

export function canSpawn(c: SpawnCtx): boolean {
  if (!c.hasSolidBelow) return false;
  if (c.difficulty === 'peaceful') return !isHostile(c.mob);
  if (isHostile(c.mob)) {
    if (c.mob === 'drowned' || c.mob === 'guardian') return true;
    return c.blockLight <= 0 && c.skyLight <= 7;
  }
  return c.skyLight >= 9 && c.blockLight === 0;
}

export function isHostile(mob: string): boolean {
  return [
    'zombie',
    'skeleton',
    'creeper',
    'spider',
    'drowned',
    'husk',
    'stray',
    'witch',
    'guardian',
  ].includes(mob);
}
