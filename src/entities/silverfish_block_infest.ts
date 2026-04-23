export interface InfestCtx {
  hitBlock: string;
  hasSilkTouch: boolean;
}

export const INFESTABLE = new Set([
  'stone',
  'cobblestone',
  'stone_bricks',
  'mossy_stone_bricks',
  'cracked_stone_bricks',
  'chiseled_stone_bricks',
  'deepslate',
]);

export function spawnsOnBreak(c: InfestCtx): boolean {
  if (c.hasSilkTouch) return false;
  return c.hitBlock.startsWith('infested_');
}

export function infestedName(block: string): string | undefined {
  if (INFESTABLE.has(block)) return `infested_${block}`;
  return undefined;
}
