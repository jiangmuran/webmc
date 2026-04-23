export interface DuplicateCtx {
  templateId: string;
  matchingBlock: string;
  diamondCount: number;
}

export const DIAMOND_COST = 7;

export const MATCH: Record<string, string> = {
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

export function canDuplicate(c: DuplicateCtx): boolean {
  if (c.diamondCount < DIAMOND_COST) return false;
  const needed = MATCH[c.templateId];
  if (!needed) return false;
  return c.matchingBlock === needed;
}

export function outputCount(): number {
  return 2;
}
