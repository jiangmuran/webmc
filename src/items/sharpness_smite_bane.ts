// Sharpness / Smite / Bane of Arthropods. Add bonus melee damage.

export const SHARPNESS_MAX = 5;
export const SMITE_MAX = 5;
export const BANE_MAX = 5;

export function sharpnessBonus(level: number): number {
  if (level <= 0) return 0;
  return 1 + (level - 1) * 0.5;
}

export function smiteBonus(level: number, targetType: string): number {
  if (level <= 0) return 0;
  if (!isUndead(targetType)) return 0;
  return level * 2.5;
}

export function baneBonus(level: number, targetType: string): number {
  if (level <= 0) return 0;
  if (!isArthropod(targetType)) return 0;
  return level * 2.5;
}

function isUndead(t: string): boolean {
  return (
    t === 'zombie' ||
    t === 'skeleton' ||
    t === 'husk' ||
    t === 'drowned' ||
    t === 'wither_skeleton' ||
    t === 'zombified_piglin' ||
    t === 'phantom' ||
    t === 'zoglin' ||
    t === 'stray' ||
    t === 'bogged'
  );
}

function isArthropod(t: string): boolean {
  return (
    t === 'spider' || t === 'cave_spider' || t === 'silverfish' || t === 'endermite' || t === 'bee'
  );
}

// Sharpness/Smite/Bane are mutually exclusive on a single weapon.
export function mutuallyExclusive(...levels: number[]): boolean {
  return levels.filter((n) => n > 0).length <= 1;
}
