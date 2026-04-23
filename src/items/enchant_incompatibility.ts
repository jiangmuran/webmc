export const INCOMPATIBLE_PAIRS: [string, string][] = [
  ['sharpness', 'smite'],
  ['sharpness', 'bane_of_arthropods'],
  ['smite', 'bane_of_arthropods'],
  ['fortune', 'silk_touch'],
  ['infinity', 'mending'],
  ['protection', 'blast_protection'],
  ['protection', 'fire_protection'],
  ['protection', 'projectile_protection'],
  ['blast_protection', 'fire_protection'],
  ['blast_protection', 'projectile_protection'],
  ['fire_protection', 'projectile_protection'],
  ['depth_strider', 'frost_walker'],
  ['multishot', 'piercing'],
  ['loyalty', 'riptide'],
  ['channeling', 'riptide'],
];

function pairKey(a: string, b: string): string {
  return [a, b].sort().join('|');
}

const INCOMPAT_SET = new Set(INCOMPATIBLE_PAIRS.map(([a, b]) => pairKey(a, b)));

export function areIncompatible(a: string, b: string): boolean {
  if (a === b) return true;
  return INCOMPAT_SET.has(pairKey(a, b));
}

export function validCombination(active: string[]): boolean {
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const a = active[i];
      const b = active[j];
      if (a !== undefined && b !== undefined && areIncompatible(a, b)) return false;
    }
  }
  return true;
}
