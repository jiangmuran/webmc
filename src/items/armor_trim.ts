// Armor trims. Decorative patterns applied via smithing template + mineral
// ingredient. Purely cosmetic; no stat effect. Each trim has a material
// color and a pattern name.

export type TrimMaterial =
  | 'iron'
  | 'copper'
  | 'gold'
  | 'lapis'
  | 'emerald'
  | 'diamond'
  | 'netherite'
  | 'redstone'
  | 'amethyst'
  | 'quartz';

export type TrimPattern =
  | 'sentry'
  | 'vex'
  | 'wild'
  | 'coast'
  | 'dune'
  | 'wayfinder'
  | 'raiser'
  | 'shaper'
  | 'host'
  | 'ward'
  | 'silence'
  | 'tide'
  | 'snout'
  | 'rib'
  | 'eye'
  | 'spire';

export interface Trim {
  material: TrimMaterial;
  pattern: TrimPattern;
}

export const TRIM_MATERIAL_COLORS: Record<TrimMaterial, readonly [number, number, number]> = {
  iron: [215, 215, 215],
  copper: [185, 115, 85],
  gold: [232, 199, 96],
  lapis: [56, 80, 160],
  emerald: [95, 180, 90],
  diamond: [170, 230, 215],
  netherite: [72, 55, 55],
  redstone: [200, 60, 60],
  amethyst: [160, 95, 200],
  quartz: [230, 230, 215],
};

export interface TrimApplicationQuery {
  template: TrimPattern;
  ingredient: TrimMaterial;
  armorName: string;
}

export function applyTrim(q: TrimApplicationQuery): Trim {
  return { material: q.ingredient, pattern: q.template };
}

// Two trims match if both material + pattern match — used for "armor
// trim" advancement criteria.
export function trimsEqual(a: Trim | null, b: Trim | null): boolean {
  if (!a || !b) return a === b;
  return a.material === b.material && a.pattern === b.pattern;
}
