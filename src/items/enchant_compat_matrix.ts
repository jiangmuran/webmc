// Enchantment compatibility matrix. Some enchantments are mutually
// exclusive (protection family, sharpness/smite/bane, multishot/piercing).

const INCOMPAT: Record<string, string[]> = {
  protection: ['projectile_protection', 'blast_protection', 'fire_protection'],
  projectile_protection: ['protection', 'blast_protection', 'fire_protection'],
  blast_protection: ['protection', 'projectile_protection', 'fire_protection'],
  fire_protection: ['protection', 'projectile_protection', 'blast_protection'],
  // Wiki (minecraft.wiki/w/Breach): "Breach is incompatible with
  // Density, Smite, Bane of Arthropods, Sharpness, and Impaling."
  // Wiki (minecraft.wiki/w/Density): "Density is mutually exclusive
  // with Breach" — and ONLY Breach. Old matrix incorrectly listed
  // density as conflicting with sharpness/smite/bane, blocking
  // canonical Density+Sharpness mace builds.
  sharpness: ['smite', 'bane_of_arthropods', 'breach'],
  smite: ['sharpness', 'bane_of_arthropods', 'breach'],
  bane_of_arthropods: ['sharpness', 'smite', 'breach'],
  breach: ['sharpness', 'smite', 'bane_of_arthropods', 'density', 'impaling'],
  density: ['breach'],
  impaling: ['breach'],
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
