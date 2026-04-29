// Enchantment compatibility matrix. Some enchantments are mutually
// exclusive (protection family, sharpness/smite/bane, multishot/piercing).

const INCOMPAT: Record<string, string[]> = {
  protection: ['projectile_protection', 'blast_protection', 'fire_protection'],
  projectile_protection: ['protection', 'blast_protection', 'fire_protection'],
  blast_protection: ['protection', 'projectile_protection', 'fire_protection'],
  fire_protection: ['protection', 'projectile_protection', 'blast_protection'],
  sharpness: ['smite', 'bane_of_arthropods', 'breach', 'density'],
  smite: ['sharpness', 'bane_of_arthropods', 'breach', 'density'],
  bane_of_arthropods: ['sharpness', 'smite', 'breach', 'density'],
  // Wiki: breach + density (1.21 mace enchants) are also in the
  // sharpness family — adding any one excludes the others.
  breach: ['sharpness', 'smite', 'bane_of_arthropods', 'density'],
  density: ['sharpness', 'smite', 'bane_of_arthropods', 'breach'],
  multishot: ['piercing'],
  piercing: ['multishot'],
  loyalty: ['riptide'],
  riptide: ['loyalty', 'channeling'],
  channeling: ['riptide'],
  infinity: ['mending'],
  mending: ['infinity'],
  depth_strider: ['frost_walker'],
  frost_walker: ['depth_strider'],
  // Wiki: silk_touch and fortune are mutually exclusive on tools (both
  // affect drops). Was missing — could enchant a pickaxe with both.
  silk_touch: ['fortune'],
  fortune: ['silk_touch'],
  // Wiki: luck_of_the_sea + lure are compatible (both fishing rod), but
  // the rod cannot have multiple drown protections — no extra cases.
};

export function isCompatible(a: string, b: string): boolean {
  if (a === b) return true;
  return !(INCOMPAT[a]?.includes(b) ?? false);
}

export function incompatibleWith(id: string): string[] {
  return INCOMPAT[id] ?? [];
}
