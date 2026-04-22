// Decorated pot crafting. 4 ingredients placed in a + pattern: one on
// each face. Each ingredient can be a pottery sherd OR a brick (plain
// face). Pots crafted from all 4 bricks = plain pot that drops as item;
// pots with any sherd become a decorated pot block.

export type SherdOrBrick =
  | 'webmc:brick'
  | 'webmc:angler_pottery_sherd'
  | 'webmc:archer_pottery_sherd'
  | 'webmc:arms_up_pottery_sherd'
  | 'webmc:blade_pottery_sherd'
  | 'webmc:brewer_pottery_sherd'
  | 'webmc:burn_pottery_sherd'
  | 'webmc:danger_pottery_sherd'
  | 'webmc:explorer_pottery_sherd'
  | 'webmc:flow_pottery_sherd'
  | 'webmc:friend_pottery_sherd'
  | 'webmc:guster_pottery_sherd'
  | 'webmc:heart_pottery_sherd'
  | 'webmc:heartbreak_pottery_sherd'
  | 'webmc:howl_pottery_sherd'
  | 'webmc:miner_pottery_sherd'
  | 'webmc:mourner_pottery_sherd'
  | 'webmc:plenty_pottery_sherd'
  | 'webmc:prize_pottery_sherd'
  | 'webmc:scrape_pottery_sherd'
  | 'webmc:sheaf_pottery_sherd'
  | 'webmc:shelter_pottery_sherd'
  | 'webmc:skull_pottery_sherd'
  | 'webmc:snort_pottery_sherd'
  | 'webmc:bolt_pottery_sherd';

export interface PotCraftQuery {
  north: SherdOrBrick;
  south: SherdOrBrick;
  east: SherdOrBrick;
  west: SherdOrBrick;
}

export interface PotCraftResult {
  kind: 'plain_pot' | 'decorated_pot';
  itemId: string;
  faces: {
    north: SherdOrBrick;
    south: SherdOrBrick;
    east: SherdOrBrick;
    west: SherdOrBrick;
  };
}

export function craftPot(q: PotCraftQuery): PotCraftResult {
  const allBrick =
    q.north === 'webmc:brick' &&
    q.south === 'webmc:brick' &&
    q.east === 'webmc:brick' &&
    q.west === 'webmc:brick';
  return {
    kind: allBrick ? 'plain_pot' : 'decorated_pot',
    itemId: allBrick ? 'webmc:decorated_pot' : 'webmc:decorated_pot',
    faces: {
      north: q.north,
      south: q.south,
      east: q.east,
      west: q.west,
    },
  };
}

// Breaking a decorated pot without a pickaxe shatters it: drops up to 4
// sherd/brick items. With a pickaxe (MC 1.20.3+): drops the decorated pot
// block as an item, preserving the face pattern.
export interface BreakQuery {
  withPickaxe: boolean;
  faces: PotCraftResult['faces'];
}

export interface BreakResult {
  drops: { item: string; count: number }[];
}

export function breakPot(q: BreakQuery): BreakResult {
  if (q.withPickaxe) {
    return {
      drops: [{ item: 'webmc:decorated_pot', count: 1 }],
    };
  }
  return {
    drops: [
      { item: q.faces.north, count: 1 },
      { item: q.faces.south, count: 1 },
      { item: q.faces.east, count: 1 },
      { item: q.faces.west, count: 1 },
    ],
  };
}
