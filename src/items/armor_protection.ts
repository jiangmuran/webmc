// Armor damage reduction. Each armor point absorbs 4% of physical
// damage, capped at 80%. Toughness reduces the damage-penalty at high
// incoming damage. Enchantments further reduce via EPF (Enchantment
// Protection Factor) capped at 20.

export interface ArmorStats {
  armor: number; // total armor points
  toughness: number; // diamond/netherite toughness
  epf: number; // sum of protection-type enchantments
}

export function reducedDamage(incoming: number, s: ArmorStats): number {
  const reduction = s.armor - incoming / (2 + s.toughness / 4);
  const absorb = Math.max(s.armor / 5, reduction) / 25;
  const afterArmor = incoming * (1 - Math.min(0.8, absorb));
  const epfClamped = Math.min(20, s.epf);
  const afterEnchant = afterArmor * (1 - epfClamped / 25);
  return Math.max(0, afterEnchant);
}

// Enchantment protection factor by type. Each counts up to 20 total.
export function protectionEpf(level: number): number {
  return level * 1;
}
export function blastProtectionEpf(level: number, isExplosion: boolean): number {
  return isExplosion ? level * 2 : 0;
}
export function fireProtectionEpf(level: number, isFire: boolean): number {
  return isFire ? level * 2 : 0;
}
export function projectileProtectionEpf(level: number, isProjectile: boolean): number {
  return isProjectile ? level * 2 : 0;
}
export function featherFallingEpf(level: number, isFall: boolean): number {
  return isFall ? level * 3 : 0;
}
