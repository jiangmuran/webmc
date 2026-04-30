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

// An azalea leaf with flowers drops a small chance at a flowering
// azalea sapling when broken or decayed.
//
// Wiki (minecraft.wiki/w/Azalea): "5% chance to drop azaleas.
// Fortune increases the rate to 6.25% at level I, 8.33% at level
// II and 10% at level III." Old `0.02 + withFortune * 0.01` gave
// 2%/3%/4%/5% — wrong base AND wrong fortune curve. New table
// reproduces the exact wiki numbers.
const AZALEA_DROP_CHANCE = [0.05, 0.0625, 0.0833, 0.1] as const;
export function flowerDrop(roll: number, withFortune = 0): { item: string; count: number }[] {
  const idx = Math.max(0, Math.min(3, Math.floor(withFortune)));
  const chance = AZALEA_DROP_CHANCE[idx] ?? AZALEA_DROP_CHANCE[0];
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

// Azalea placement. Wiki (minecraft.wiki/w/Azalea#Usage):
// "Azaleas can be placed on grass blocks, dirt, coarse dirt, rooted
// dirt, podzol, moss blocks, farmland, mud, muddy mangrove roots,
// and clay." Old set was missing coarse_dirt, muddy_mangrove_roots,
// and clay — players in lush-cave/swamp-ish environments could not
// plant an azalea on the ground the wiki explicitly allows.
const PLACEABLE_ON = new Set([
  'webmc:dirt',
  'webmc:grass_block',
  'webmc:coarse_dirt',
  'webmc:moss_block',
  'webmc:rooted_dirt',
  'webmc:podzol',
  'webmc:farmland',
  'webmc:mud',
  'webmc:muddy_mangrove_roots',
  'webmc:clay',
]);

export function canPlaceAzaleaOn(surface: string): boolean {
  return PLACEABLE_ON.has(surface);
}
