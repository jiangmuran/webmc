// Smithing table. Two kinds of operations: netherite upgrade (template +
// diamond tool + netherite ingot → netherite tool) and armor trim
// application (template + armor + material → trimmed armor).

import { applyTrim, type TrimMaterial, type TrimPattern } from './armor_trim';
import type { Enchanted } from './enchantment';

// Wiki (minecraft.wiki/w/Smithing_Template): 18 canonical trim
// templates + netherite_upgrade. Old union was 16 trims, missing
// the 1.21+ Trial Chambers additions (bolt, flow). Sibling
// smithing_template_duplicate.ts already has both — this main
// dispatch was the holdout.
export type SmithingTemplate =
  | 'netherite_upgrade'
  | 'coast_trim'
  | 'dune_trim'
  | 'eye_trim'
  | 'host_trim'
  | 'raiser_trim'
  | 'rib_trim'
  | 'sentry_trim'
  | 'shaper_trim'
  | 'silence_trim'
  | 'snout_trim'
  | 'spire_trim'
  | 'tide_trim'
  | 'vex_trim'
  | 'ward_trim'
  | 'wayfinder_trim'
  | 'wild_trim'
  | 'bolt_trim'
  | 'flow_trim';

export interface NetheriteUpgrade {
  diamond: string; // input item name like 'webmc:diamond_pickaxe'
  netherite: string; // output item name like 'webmc:netherite_pickaxe'
}

export const NETHERITE_UPGRADES: readonly NetheriteUpgrade[] = [
  { diamond: 'webmc:diamond_pickaxe', netherite: 'webmc:netherite_pickaxe' },
  { diamond: 'webmc:diamond_axe', netherite: 'webmc:netherite_axe' },
  { diamond: 'webmc:diamond_sword', netherite: 'webmc:netherite_sword' },
  { diamond: 'webmc:diamond_shovel', netherite: 'webmc:netherite_shovel' },
  { diamond: 'webmc:diamond_hoe', netherite: 'webmc:netherite_hoe' },
  { diamond: 'webmc:diamond_helmet', netherite: 'webmc:netherite_helmet' },
  { diamond: 'webmc:diamond_chestplate', netherite: 'webmc:netherite_chestplate' },
  { diamond: 'webmc:diamond_leggings', netherite: 'webmc:netherite_leggings' },
  { diamond: 'webmc:diamond_boots', netherite: 'webmc:netherite_boots' },
];

export function netheriteUpgradeFor(diamond: string): string | null {
  for (const u of NETHERITE_UPGRADES) if (u.diamond === diamond) return u.netherite;
  return null;
}

export interface SmithingQuery {
  template: SmithingTemplate;
  tool: Enchanted & { name?: string };
  toolName: string; // e.g. 'webmc:diamond_sword'
  ingredientName: string; // e.g. 'webmc:netherite_ingot' or 'webmc:copper_ingot'
}

export interface SmithingResult {
  outputName: string;
  enchants: Enchanted['enchants'];
  trim: { material: TrimMaterial; pattern: TrimPattern } | null;
}

// Parse the template and dispatch to netherite upgrade or trim application.
export function applySmithing(q: SmithingQuery): SmithingResult | null {
  if (q.template === 'netherite_upgrade') {
    if (q.ingredientName !== 'webmc:netherite_ingot') return null;
    const output = netheriteUpgradeFor(q.toolName);
    if (!output) return null;
    return { outputName: output, enchants: q.tool.enchants, trim: null };
  }
  // Otherwise it's a trim template.
  const trimName = q.template.replace(/_trim$/, '') as TrimPattern;
  const material = trimMaterialFromIngredient(q.ingredientName);
  if (!material) return null;
  const trim = applyTrim({ template: trimName, ingredient: material, armorName: q.toolName });
  return { outputName: q.toolName, enchants: q.tool.enchants, trim };
}

function trimMaterialFromIngredient(ingredient: string): TrimMaterial | null {
  const map: Record<string, TrimMaterial> = {
    'webmc:iron_ingot': 'iron',
    'webmc:copper_ingot': 'copper',
    'webmc:gold_ingot': 'gold',
    'webmc:lapis_lazuli': 'lapis',
    'webmc:emerald': 'emerald',
    'webmc:diamond': 'diamond',
    'webmc:netherite_ingot': 'netherite',
    'webmc:redstone': 'redstone',
    'webmc:amethyst_shard': 'amethyst',
    'webmc:quartz': 'quartz',
  };
  return map[ingredient] ?? null;
}
