// Infested blocks. Silverfish hide inside 6 disguise blocks; mining them
// (without silk touch) releases the silverfish. Infested blocks break
// 2× faster than their disguise and glow orange to spectators.

export type InfestedKind =
  | 'webmc:infested_stone'
  | 'webmc:infested_cobblestone'
  | 'webmc:infested_stone_bricks'
  | 'webmc:infested_mossy_stone_bricks'
  | 'webmc:infested_cracked_stone_bricks'
  | 'webmc:infested_chiseled_stone_bricks'
  | 'webmc:infested_deepslate';

export const INFESTED_DISGUISES: Record<InfestedKind, string> = {
  'webmc:infested_stone': 'webmc:stone',
  'webmc:infested_cobblestone': 'webmc:cobblestone',
  'webmc:infested_stone_bricks': 'webmc:stone_bricks',
  'webmc:infested_mossy_stone_bricks': 'webmc:mossy_stone_bricks',
  'webmc:infested_cracked_stone_bricks': 'webmc:cracked_stone_bricks',
  'webmc:infested_chiseled_stone_bricks': 'webmc:chiseled_stone_bricks',
  'webmc:infested_deepslate': 'webmc:deepslate',
};

export function disguiseOf(kind: InfestedKind): string {
  return INFESTED_DISGUISES[kind];
}

export interface InfestedBreakResult {
  spawnedSilverfish: boolean;
  drops: { item: string; count: number }[];
}

export function breakInfested(kind: InfestedKind, silkTouch: boolean): InfestedBreakResult {
  if (silkTouch) {
    return { spawnedSilverfish: false, drops: [{ item: kind, count: 1 }] };
  }
  return { spawnedSilverfish: true, drops: [] };
}

// Silverfish call their buddies: breaking an infested block summons
// nearby silverfish out of adjacent infested blocks (up to 16-block
// radius). We return the number of neighbors that would "join".
export function countNearbyInfested(
  origin: { x: number; y: number; z: number },
  neighbors: readonly { x: number; y: number; z: number }[],
  isInfested: (x: number, y: number, z: number) => boolean,
): number {
  let n = 0;
  for (const p of neighbors) {
    const dx = p.x - origin.x;
    const dy = p.y - origin.y;
    const dz = p.z - origin.z;
    if (Math.hypot(dx, dy, dz) > 16) continue;
    if (isInfested(p.x, p.y, p.z)) n++;
  }
  return n;
}
