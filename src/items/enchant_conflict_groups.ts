const CONFLICT_GROUPS: string[][] = [
  ['sharpness', 'smite', 'bane_of_arthropods', 'cleaving'],
  ['protection', 'blast_protection', 'fire_protection', 'projectile_protection'],
  ['fortune', 'silk_touch'],
  ['infinity', 'mending'],
  ['depth_strider', 'frost_walker'],
  ['loyalty', 'riptide'],
  ['riptide', 'channeling'],
  ['multishot', 'piercing'],
];

export function conflicts(a: string, b: string): boolean {
  if (a === b) return false;
  for (const g of CONFLICT_GROUPS) {
    if (g.includes(a) && g.includes(b)) return true;
  }
  return false;
}

export function anyConflicts(existing: readonly string[], newEnchant: string): boolean {
  return existing.some((e) => conflicts(e, newEnchant));
}
