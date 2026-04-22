// Nether star. Dropped by the Wither on death. Used as the beacon's
// center ingredient. Has a golden glow effect in the inventory slot,
// and is indestructible (immune to lava/cactus/explosion).

export const NETHER_STAR_ID = 'webmc:nether_star';

export interface NetherStarDrop {
  quantity: 1;
  fromMob: 'wither';
}

// Wither always drops exactly 1 nether star.
export function witherDropStar(): NetherStarDrop {
  return { quantity: 1, fromMob: 'wither' };
}

// Nether star item can't despawn like regular items.
export const NETHER_STAR_DESPAWN_SEC = Infinity;

// Beacon recipe: 1 nether star + 5 glass + 3 obsidian.
export interface BeaconCraftQuery {
  netherStars: number;
  glass: number;
  obsidian: number;
}

export function craftBeacon(q: BeaconCraftQuery): { item: 'webmc:beacon'; count: 1 } | null {
  if (q.netherStars < 1 || q.glass < 5 || q.obsidian < 3) return null;
  return { item: 'webmc:beacon', count: 1 };
}

// Damage immunity: nether stars survive lava, fire, explosions.
export type DamageSource = 'lava' | 'fire' | 'explosion' | 'cactus' | 'void';

export function takesDamageFrom(source: DamageSource): boolean {
  if (source === 'void') return true;
  return false;
}

// Tooltip glint: nether star has a golden-orange glint animation.
export const GLINT_COLOR: readonly [number, number, number] = [255, 220, 90];
