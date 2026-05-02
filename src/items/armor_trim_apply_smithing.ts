// Smithing-table trim application. Wiki (minecraft.wiki/w/Smithing_Template):
// "The smithing template is consumed when used to apply a trim or
// upgrade an armor piece. To duplicate the template, use it with 7
// diamonds and a base mineral in a crafting grid."
//
// Old `consumesTemplate` returned false — players burning a snout
// trim onto netherite armor kept the template silently and never
// needed to duplicate. Sibling armor_trim_apply.ts already returns
// true; harmonised. Also expanded the template set from 13 → 18 to
// include wayfinder/shaper/silence/raiser/host (1.20 trail-ruins
// templates) and added 'resin' (1.21 pale-garden) to TRIM_MATERIALS.

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
  'wayfinder',
  'shaper',
  'silence',
  'raiser',
  'host',
  // 1.21 Trial Chambers additions
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
  // 1.21 Pale Garden / 1.21.4 — resin brick as a trim material.
  'resin',
]);

export function canApply(t: TrimInput): boolean {
  return PATTERN_TEMPLATES.has(t.template) && TRIM_MATERIALS.has(t.material);
}

export function consumesTemplate(): boolean {
  return true;
}

export function consumesMaterial(): boolean {
  return true;
}
