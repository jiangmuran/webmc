export interface SmithingInput {
  template: string;
  base: string;
  addition: string;
}

export const NETHERITE_TEMPLATE = 'netherite_upgrade_smithing_template';
// Wiki (minecraft.wiki/w/Smithing_Template): Java Edition 1.21 ships
// 18 trim templates. The 16-entry list was missing the two trial-chamber
// additions (flow, bolt), so a player smithing-applying flow_armor_trim
// or bolt_armor_trim was rejected as a non-trim template.
export const ARMOR_TRIM_TEMPLATES = [
  'coast_armor_trim',
  'dune_armor_trim',
  'eye_armor_trim',
  'host_armor_trim',
  'raiser_armor_trim',
  'rib_armor_trim',
  'sentry_armor_trim',
  'shaper_armor_trim',
  'silence_armor_trim',
  'snout_armor_trim',
  'spire_armor_trim',
  'tide_armor_trim',
  'vex_armor_trim',
  'ward_armor_trim',
  'wayfinder_armor_trim',
  'wild_armor_trim',
  'flow_armor_trim',
  'bolt_armor_trim',
];

const DIAMOND_TO_NETHERITE: Record<string, string> = {
  diamond_sword: 'netherite_sword',
  diamond_pickaxe: 'netherite_pickaxe',
  diamond_axe: 'netherite_axe',
  diamond_shovel: 'netherite_shovel',
  diamond_hoe: 'netherite_hoe',
  diamond_helmet: 'netherite_helmet',
  diamond_chestplate: 'netherite_chestplate',
  diamond_leggings: 'netherite_leggings',
  diamond_boots: 'netherite_boots',
};

export function netheriteResult(i: SmithingInput): string | undefined {
  if (i.template !== NETHERITE_TEMPLATE) return undefined;
  if (i.addition !== 'netherite_ingot') return undefined;
  return DIAMOND_TO_NETHERITE[i.base];
}

export function isTrimTemplate(template: string): boolean {
  return ARMOR_TRIM_TEMPLATES.includes(template);
}
