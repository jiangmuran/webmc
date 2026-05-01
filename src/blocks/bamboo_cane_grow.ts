// Bamboo growth. Up to 16 blocks tall. Stages: 0 (young, thin) and
// 1 (mature). Top block gets 'leaves' variant when bamboo is ≥4 tall.
//
// Wiki (minecraft.wiki/w/Bamboo): bamboo "can be planted on moss
// blocks, pale moss blocks, grass blocks, dirt, coarse dirt, rooted
// dirt, gravel, mycelium, podzol, sand, red sand, suspicious sand,
// suspicious gravel, mud, muddy mangrove roots, or other bamboo
// shoots." Old set was missing pale_moss_block, suspicious_sand,
// suspicious_gravel, muddy_mangrove_roots, AND bamboo itself — the
// last meant a player couldn't place a fresh bamboo item on top of
// an existing stalk (a routine action when extending a farm), even
// though the wiki explicitly lists "other bamboo shoots" as a valid
// placement surface.

export const MAX_HEIGHT = 16;
export const MATURE_HEIGHT = 4;

const VALID_GROUND = new Set<string>([
  'webmc:sand',
  'webmc:red_sand',
  'webmc:suspicious_sand',
  'webmc:suspicious_gravel',
  'webmc:dirt',
  'webmc:grass_block',
  'webmc:podzol',
  'webmc:mycelium',
  'webmc:mud',
  'webmc:muddy_mangrove_roots',
  'webmc:rooted_dirt',
  'webmc:moss_block',
  'webmc:pale_moss_block',
  'webmc:gravel',
  'webmc:coarse_dirt',
  'webmc:bamboo',
  'webmc:bamboo_sapling',
]);

export function canGrowOn(blockId: string): boolean {
  return VALID_GROUND.has(blockId);
}

export interface BambooGrowQuery {
  currentHeight: number;
  age: 0 | 1; // 0 = young, 1 = fully aged → can extend
  rand: () => number;
  boneMealed: boolean;
}

export const GROW_CHANCE = 0.015;

export function tryGrow(q: BambooGrowQuery): { grew: boolean; boneMealAge: boolean } {
  if (q.currentHeight >= MAX_HEIGHT) return { grew: false, boneMealAge: false };
  if (q.boneMealed) return { grew: true, boneMealAge: true };
  if (q.age === 0) return { grew: false, boneMealAge: false };
  if (q.rand() < GROW_CHANCE) return { grew: true, boneMealAge: false };
  return { grew: false, boneMealAge: false };
}

export type TopVariant = 'small_leaves' | 'large_leaves' | 'none';

export function topVariant(height: number): TopVariant {
  if (height < MATURE_HEIGHT) return 'none';
  if (height < 7) return 'small_leaves';
  return 'large_leaves';
}
