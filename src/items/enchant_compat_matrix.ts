// Enchantment compatibility matrix. Some enchantments are mutually
// exclusive (protection family, sharpness/smite/bane, multishot/piercing).

const INCOMPAT: Record<string, string[]> = {
  protection: ['projectile_protection', 'blast_protection', 'fire_protection'],
  projectile_protection: ['protection', 'blast_protection', 'fire_protection'],
  blast_protection: ['protection', 'projectile_protection', 'fire_protection'],
  fire_protection: ['protection', 'projectile_protection', 'blast_protection'],
  sharpness: ['smite', 'bane_of_arthropods'],
  smite: ['sharpness', 'bane_of_arthropods'],
  bane_of_arthropods: ['sharpness', 'smite'],
  multishot: ['piercing'],
  piercing: ['multishot'],
  loyalty: ['riptide'],
  riptide: ['loyalty', 'channeling'],
  channeling: ['riptide'],
  infinity: ['mending'],
  mending: ['infinity'],
  depth_strider: ['frost_walker'],
  frost_walker: ['depth_strider'],
};

export function isCompatible(a: string, b: string): boolean {
  if (a === b) return true;
  return !(INCOMPAT[a]?.includes(b) ?? false);
}

export function incompatibleWith(id: string): string[] {
  return INCOMPAT[id] ?? [];
}
