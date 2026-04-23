export const OBSIDIAN_BLAST_RESIST = 1200;
export const CRYING_OBSIDIAN_BLAST_RESIST = 1200;
export const REINFORCED_DEEPSLATE_BLAST_RESIST = 1200;
export const BEDROCK_BLAST_RESIST = 3_600_000;

export function survivesTntBlast(block: string): boolean {
  if (['obsidian', 'crying_obsidian', 'reinforced_deepslate', 'bedrock'].includes(block))
    return true;
  if (block === 'end_portal_frame' || block === 'end_portal') return true;
  return false;
}

export function blastResistance(block: string): number {
  switch (block) {
    case 'obsidian':
    case 'crying_obsidian':
    case 'reinforced_deepslate':
      return 1200;
    case 'bedrock':
    case 'barrier':
      return BEDROCK_BLAST_RESIST;
    case 'stone':
      return 6;
    default:
      return 0;
  }
}
