// Enchanted-book tooltip. Renders enchantment lines on item tooltips:
//   "Mending"
//   "Protection IV"
//   "Curse of Vanishing"
// Ordered: non-curses alphabetically, then curses. Level ≤ 1 shows
// no numeral; >1 shows a Roman numeral up to X.

export interface BookEnchant {
  id: string;
  level: number;
}

export interface EnchantDisplay {
  id: string;
  line: string;
  isCurse: boolean;
}

const CURSES = new Set(['curse_of_vanishing', 'curse_of_binding']);

const ENCHANT_NAMES: Record<string, string> = {
  sharpness: 'Sharpness',
  smite: 'Smite',
  bane_of_arthropods: 'Bane of Arthropods',
  knockback: 'Knockback',
  fire_aspect: 'Fire Aspect',
  looting: 'Looting',
  sweeping_edge: 'Sweeping Edge',
  protection: 'Protection',
  fire_protection: 'Fire Protection',
  feather_falling: 'Feather Falling',
  blast_protection: 'Blast Protection',
  projectile_protection: 'Projectile Protection',
  respiration: 'Respiration',
  aqua_affinity: 'Aqua Affinity',
  thorns: 'Thorns',
  depth_strider: 'Depth Strider',
  frost_walker: 'Frost Walker',
  soul_speed: 'Soul Speed',
  swift_sneak: 'Swift Sneak',
  efficiency: 'Efficiency',
  silk_touch: 'Silk Touch',
  unbreaking: 'Unbreaking',
  fortune: 'Fortune',
  power: 'Power',
  punch: 'Punch',
  flame: 'Flame',
  infinity: 'Infinity',
  loyalty: 'Loyalty',
  impaling: 'Impaling',
  riptide: 'Riptide',
  channeling: 'Channeling',
  multishot: 'Multishot',
  quick_charge: 'Quick Charge',
  piercing: 'Piercing',
  mending: 'Mending',
  luck_of_the_sea: 'Luck of the Sea',
  lure: 'Lure',
  density: 'Density',
  breach: 'Breach',
  wind_burst: 'Wind Burst',
  curse_of_vanishing: 'Curse of Vanishing',
  curse_of_binding: 'Curse of Binding',
};

export function romanNumeral(n: number): string {
  const map: readonly [number, string][] = [
    [10, 'X'],
    [9, 'IX'],
    [8, 'VIII'],
    [7, 'VII'],
    [6, 'VI'],
    [5, 'V'],
    [4, 'IV'],
    [3, 'III'],
    [2, 'II'],
    [1, 'I'],
  ];
  if (n <= 0) return '';
  if (n > 10) return n.toString();
  for (const [v, s] of map) if (n >= v) return s;
  return '';
}

export function displayEnchantLine(e: BookEnchant): string {
  const name = ENCHANT_NAMES[e.id] ?? e.id;
  if (e.level <= 1) return name;
  return `${name} ${romanNumeral(e.level)}`;
}

export function orderTooltip(enchants: readonly BookEnchant[]): EnchantDisplay[] {
  const base: EnchantDisplay[] = enchants.map((e) => ({
    id: e.id,
    line: displayEnchantLine(e),
    isCurse: CURSES.has(e.id),
  }));
  base.sort((a, b) => {
    if (a.isCurse !== b.isCurse) return a.isCurse ? 1 : -1;
    return a.line.localeCompare(b.line);
  });
  return base;
}
