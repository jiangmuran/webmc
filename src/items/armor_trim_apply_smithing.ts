export interface TrimInput {
  base: string;
  template: string;
  material: string;
}

export const PATTERN_TEMPLATES = new Set([
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
  'flow',
  'bolt',
]);

export const TRIM_MATERIALS = new Set([
  'iron',
  'copper',
  'gold',
  'diamond',
  'netherite',
  'emerald',
  'redstone',
  'amethyst',
  'lapis',
  'quartz',
]);

export function canApply(t: TrimInput): boolean {
  return PATTERN_TEMPLATES.has(t.template) && TRIM_MATERIALS.has(t.material);
}

export function consumesTemplate(): boolean {
  return false;
}

export function consumesMaterial(): boolean {
  return true;
}
