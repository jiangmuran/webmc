// Armor trim application via smithing table. Needs trim template +
// armor + material. Result armor has visible trim patterned with
// material-tinted color; does not affect stats.

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
  | 'quartz'
  | 'resin';

export interface TrimInputs {
  template: string;
  armor: string;
  material: TrimMaterial | 'other';
}

const VALID_TEMPLATES = new Set([
  'sentry',
  'dune',
  'coast',
  'wild',
  'ward',
  'eye',
  'vex',
  'tide',
  'snout',
  'rib',
  'spire',
  'wayfinder',
  'shaper',
  'silence',
  'raiser',
  'host',
  'flow',
  'bolt',
]);

export function canApplyTrim(i: TrimInputs): boolean {
  if (i.material === 'other') return false;
  if (!VALID_TEMPLATES.has(i.template)) return false;
  return (
    i.armor.endsWith('_helmet') ||
    i.armor.endsWith('_chestplate') ||
    i.armor.endsWith('_leggings') ||
    i.armor.endsWith('_boots')
  );
}

export function trimAffectsStats(): boolean {
  return false;
}

export function templateConsumed(): boolean {
  return true;
}

export function materialConsumed(): number {
  return 1;
}
