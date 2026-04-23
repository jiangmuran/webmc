// Smithing template copy recipe. 1 template + 7 diamonds + matching
// block (netherite_upgrade template → netherite). Returns 2 templates.

export interface TemplateCraft {
  template: string;
  diamonds: number;
  matchingBlock: string | null;
  netheriteUpgradeIngredient?: string;
}

export const TEMPLATE_COPY_DIAMOND_COST = 7;
export const TEMPLATE_OUTPUT_COUNT = 2;

export const MATCHING_BLOCK: Record<string, string> = {
  netherite_upgrade: 'netherite_ingot',
  sentry: 'cobblestone',
  dune: 'sandstone',
  coast: 'cobblestone',
  wild: 'mossy_cobblestone',
  ward: 'cobbled_deepslate',
  eye: 'end_stone_bricks',
  vex: 'cobblestone',
  tide: 'prismarine',
  snout: 'blackstone',
  rib: 'netherrack',
  spire: 'purpur_block',
  flow: 'breeze_rod',
  bolt: 'copper_block',
};

export function canCopy(c: TemplateCraft): boolean {
  if (c.diamonds < TEMPLATE_COPY_DIAMOND_COST) return false;
  const needed = MATCHING_BLOCK[c.template];
  if (!needed) return false;
  return c.matchingBlock === needed;
}

export function outputCount(): number {
  return TEMPLATE_OUTPUT_COUNT;
}
