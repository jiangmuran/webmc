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

// Wiki (minecraft.wiki/w/Enchanting#Tooltip): in-game tooltip shows
// the Roman numeral whenever the enchantment's max level > 1, even
// for level I. Single-level enchants (Mending, Silk Touch, Infinity,
// Aqua Affinity, Channeling, Flame, Multishot, both curses) display
// only the name. Old code suppressed the numeral whenever `level <= 1`,
// so "Sharpness I" rendered as "Sharpness" — indistinguishable from
// a single-level enchant in the UI.
const ENCHANT_MAX_LEVEL: Record<string, number> = {
  sharpness: 5,
  smite: 5,
  bane_of_arthropods: 5,
  knockback: 2,
  fire_aspect: 2,
  looting: 3,
  sweeping_edge: 3,
  protection: 4,
  fire_protection: 4,
  feather_falling: 4,
  blast_protection: 4,
  projectile_protection: 4,
  respiration: 3,
  aqua_affinity: 1,
  thorns: 3,
  depth_strider: 3,
  frost_walker: 2,
  soul_speed: 3,
  swift_sneak: 3,
  efficiency: 5,
  silk_touch: 1,
  unbreaking: 3,
  fortune: 3,
  power: 5,
  punch: 2,
  flame: 1,
  infinity: 1,
  loyalty: 3,
  impaling: 5,
  riptide: 3,
  channeling: 1,
  multishot: 1,
  quick_charge: 3,
  piercing: 4,
  mending: 1,
  luck_of_the_sea: 3,
  lure: 3,
  density: 5,
  breach: 4,
  wind_burst: 3,
  curse_of_vanishing: 1,
  curse_of_binding: 1,
};

export function displayEnchantLine(e: BookEnchant): string {
  const name = ENCHANT_NAMES[e.id] ?? e.id;
  const max = ENCHANT_MAX_LEVEL[e.id] ?? 1;
  if (max <= 1) return name;
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
