// Smithing table with templates (1.20). Three slots:
//   template + base armor + material = trimmed armor
// The template is consumed (unless crafted via a template + netherite
// ingot recipe, which preserves it). Netherite upgrade works the same
// way but with the netherite upgrade template.

export type TrimTemplate =
  | 'webmc:coast_armor_trim_template'
  | 'webmc:sentry_armor_trim_template'
  | 'webmc:dune_armor_trim_template'
  | 'webmc:wild_armor_trim_template'
  | 'webmc:ward_armor_trim_template'
  | 'webmc:eye_armor_trim_template'
  | 'webmc:vex_armor_trim_template'
  | 'webmc:tide_armor_trim_template'
  | 'webmc:snout_armor_trim_template'
  | 'webmc:rib_armor_trim_template'
  | 'webmc:spire_armor_trim_template'
  | 'webmc:silence_armor_trim_template'
  | 'webmc:raiser_armor_trim_template'
  | 'webmc:host_armor_trim_template'
  | 'webmc:wayfinder_armor_trim_template'
  | 'webmc:shaper_armor_trim_template'
  | 'webmc:flow_armor_trim_template'
  | 'webmc:bolt_armor_trim_template';

export type SmithingTemplate = TrimTemplate | 'webmc:netherite_upgrade';

export type TrimMaterial =
  | 'iron'
  | 'gold'
  | 'diamond'
  | 'netherite'
  | 'copper'
  | 'emerald'
  | 'redstone'
  | 'lapis'
  | 'amethyst'
  | 'quartz'
  | 'resin';

export interface SmithingQuery {
  template: SmithingTemplate;
  base: string; // e.g. "webmc:diamond_chestplate"
  materialItem: string;
}

export interface SmithingResult {
  output: { item: string; trim?: { template: string; material: TrimMaterial } } | null;
  consumedTemplate: boolean;
}

const TRIM_MATERIAL_OF: Record<string, TrimMaterial> = {
  'webmc:iron_ingot': 'iron',
  'webmc:gold_ingot': 'gold',
  'webmc:diamond': 'diamond',
  'webmc:netherite_ingot': 'netherite',
  'webmc:copper_ingot': 'copper',
  'webmc:emerald': 'emerald',
  'webmc:redstone': 'redstone',
  'webmc:lapis_lazuli': 'lapis',
  'webmc:amethyst_shard': 'amethyst',
  'webmc:quartz': 'quartz',
  'webmc:resin_brick': 'resin',
};

export function trySmith(q: SmithingQuery): SmithingResult {
  // Netherite upgrade: base must be diamond_*, material must be netherite.
  if (q.template === 'webmc:netherite_upgrade') {
    if (!q.base.startsWith('webmc:diamond_')) {
      return { output: null, consumedTemplate: false };
    }
    if (q.materialItem !== 'webmc:netherite_ingot') {
      return { output: null, consumedTemplate: false };
    }
    const upgraded = q.base.replace('webmc:diamond_', 'webmc:netherite_');
    return { output: { item: upgraded }, consumedTemplate: true };
  }
  // Trim application: base must be armor piece (ends with _helmet /
  // _chestplate / _leggings / _boots).
  if (
    !q.base.endsWith('_helmet') &&
    !q.base.endsWith('_chestplate') &&
    !q.base.endsWith('_leggings') &&
    !q.base.endsWith('_boots')
  ) {
    return { output: null, consumedTemplate: false };
  }
  const material = TRIM_MATERIAL_OF[q.materialItem];
  if (!material) return { output: null, consumedTemplate: false };
  return {
    output: {
      item: q.base,
      trim: { template: q.template, material },
    },
    consumedTemplate: true,
  };
}

// Template duplication: template + 7 diamonds + 1 matching "base mineral"
// crafts into 2 templates.
export const TEMPLATE_DUPLICATION_DIAMONDS = 7;
