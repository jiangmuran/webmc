// Sheep shearing drops 1..3 wool of its color; wool regrows when sheep
// eats grass block (block becomes dirt).

export interface SheepState {
  sheared: boolean;
  color: string;
}

export function shear(s: SheepState, rand: () => number): { wool: number; color: string } | null {
  if (s.sheared) return null;
  const count = 1 + Math.floor(rand() * 3);
  s.sheared = true;
  return { wool: count, color: s.color };
}

export interface EatGrassResult {
  wasSheared: boolean;
  consumedBlock: 'grass_block' | 'tall_grass' | null;
}

export function eatGrass(
  s: SheepState,
  blockType: 'grass_block' | 'tall_grass' | 'other',
): EatGrassResult {
  if (blockType === 'other') return { wasSheared: s.sheared, consumedBlock: null };
  const wasSheared = s.sheared;
  s.sheared = false;
  return { wasSheared, consumedBlock: blockType };
}

export function regrowsFromEating(blockType: string): boolean {
  return blockType === 'grass_block' || blockType === 'tall_grass';
}
