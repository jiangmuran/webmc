export interface Enchantment {
  id: string;
  level: number;
}

const CURSES = ['curse_of_vanishing', 'curse_of_binding'];

export function strippable(enchants: readonly Enchantment[]): readonly Enchantment[] {
  return enchants.filter((e) => !CURSES.includes(e.id));
}

export function retained(enchants: readonly Enchantment[]): readonly Enchantment[] {
  return enchants.filter((e) => CURSES.includes(e.id));
}

export function xpValueOfStripped(enchants: readonly Enchantment[]): number {
  return strippable(enchants).reduce((s, e) => s + e.level * 3, 0);
}

export function repairAmount(
  aDurability: number,
  bDurability: number,
  maxDurability: number,
): number {
  const bonus = Math.floor(maxDurability * 0.05);
  return Math.min(maxDurability, aDurability + bDurability + bonus);
}
