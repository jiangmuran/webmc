export const SOUL_BLOCKS = new Set(['soul_sand', 'soul_soil']);

export function onSoulBlock(block: string): boolean {
  return SOUL_BLOCKS.has(block);
}

export function movementMultiplier(onSoul: boolean, soulSpeedLevel: number): number {
  if (!onSoul) return 1;
  return 0.4 + Math.min(1, soulSpeedLevel * 0.21);
}

export function applyDurabilityChance(soulSpeedLevel: number, rng: () => number): boolean {
  if (soulSpeedLevel === 0) return false;
  return rng() < 0.04 / soulSpeedLevel;
}
