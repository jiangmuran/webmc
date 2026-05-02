// Wiki (minecraft.wiki/w/Breach, /w/Density): Mace enchantments
// expand the canonical damage-conflict group:
// * Breach conflicts with Density, Smite, Bane of Arthropods, AND
//   Sharpness + Impaling (the latter two are practically unreachable
//   on a single item but listed by wiki).
// * Density conflicts only with Breach.
//
// Old groups omitted Breach + Density entirely, allowing illegal
// stacks like Sharpness V + Breach IV on a hypothetical maced sword
// (or Density + Breach on the same mace).
const CONFLICT_GROUPS: string[][] = [
  ['sharpness', 'smite', 'bane_of_arthropods', 'breach'],
  ['protection', 'blast_protection', 'fire_protection', 'projectile_protection'],
  ['fortune', 'silk_touch'],
  ['infinity', 'mending'],
  ['depth_strider', 'frost_walker'],
  ['loyalty', 'riptide'],
  ['riptide', 'channeling'],
  ['multishot', 'piercing'],
  ['breach', 'density'],
  // Impaling (trident) + Breach (mace) can't coexist physically since
  // each goes on a different item, but the wiki lists them as
  // incompatible — kept here for completeness of the conflict
  // matrix for future tool families.
  ['breach', 'impaling'],
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
