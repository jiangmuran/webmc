// Breach (mace-only). Reduces target armor effectiveness by 15% per level.

export const BREACH_MAX = 4;

export function armorEffectivenessFactor(level: number): number {
  const eff = Math.max(0, Math.min(BREACH_MAX, level));
  return Math.max(0, 1 - 0.15 * eff);
}

export function armorAfter(rawArmor: number, level: number): number {
  return rawArmor * armorEffectivenessFactor(level);
}

export function appliesOnlyTo(itemKind: string): boolean {
  return itemKind === 'mace';
}

// Wiki (minecraft.wiki/w/Breach#Incompatibilities): "Breach is
// incompatible with Density, Smite, and Bane of Arthropods. It is
// also incompatible with Sharpness and Impaling, however in Survival
// these incompatibilities cannot be encountered, as no weapon types
// have access to both Breach and Sharpness/Impaling." Old list had
// only `density`, allowing breach + smite or breach + bane stacks
// that the wiki forbids in normal play.
export function incompatibleWith(): string[] {
  return ['density', 'smite', 'bane_of_arthropods'];
}
