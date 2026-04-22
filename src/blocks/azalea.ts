// Azalea + flowering azalea. Bone-meal on an azalea sapling grows it
// into a full azalea tree with oak-like logs, a moss block at the base,
// and rooted dirt + dripleaves in a small understory.

export type AzaleaKind = 'azalea' | 'flowering_azalea';

export interface AzaleaTreeLayout {
  height: number;
  canopyRadius: number;
  rootedDirtRadius: number;
  flowering: boolean;
  mossBlockAtBase: boolean;
}

export interface AzaleaGrowQuery {
  kind: AzaleaKind;
  rng: () => number;
}

export function growAzaleaTree(q: AzaleaGrowQuery): AzaleaTreeLayout {
  return {
    height: 6 + Math.floor(q.rng() * 4),
    canopyRadius: 2 + Math.floor(q.rng() * 2),
    rootedDirtRadius: 1 + Math.floor(q.rng() * 2),
    flowering: q.kind === 'flowering_azalea',
    mossBlockAtBase: true,
  };
}

// An azalea leaf with flowers drops a small chance at a flowering azalea
// sapling when bone-mealed or broken.
export function flowerDrop(roll: number, withFortune = 0): { item: string; count: number }[] {
  const chance = 0.02 + withFortune * 0.01;
  if (roll < chance) {
    return [{ item: 'webmc:flowering_azalea_sapling', count: 1 }];
  }
  return [];
}

// A mature azalea planted on moss-adjacent dirt triggers nearby moss
// spread within a 2-block radius.
export const MOSS_SPREAD_RADIUS = 2;

export function convertsToMossBelow(
  target: string,
): 'webmc:moss_block' | 'webmc:rooted_dirt' | null {
  if (target === 'webmc:dirt' || target === 'webmc:grass_block') return 'webmc:moss_block';
  if (target === 'webmc:coarse_dirt') return 'webmc:rooted_dirt';
  return null;
}

// Azalea placement: can be placed on dirt, moss, or on top of rooted
// dirt. Planted on anything else refuses.
const PLACEABLE_ON = new Set([
  'webmc:dirt',
  'webmc:grass_block',
  'webmc:moss_block',
  'webmc:rooted_dirt',
  'webmc:podzol',
  'webmc:farmland',
  'webmc:mud',
]);

export function canPlaceAzaleaOn(surface: string): boolean {
  return PLACEABLE_ON.has(surface);
}
