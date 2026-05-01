// Sugar cane. Grows on sand/dirt/grass-family blocks adjacent to
// water, up to 3 stalks tall. Random tick: 1 age++; at age 16, grows
// up (if height<3).
//
// Wiki (minecraft.wiki/w/Sugar_Cane): "Sugar cane can be planted on
// a grass block, dirt, coarse dirt, podzol, mycelium, sand, red
// sand, mud, rooted dirt, or moss block, but only if at least one
// block adjacent to it is water." Old VALID_GROUND was missing
// `mycelium` — sugar cane silently couldn't be placed on the
// mushroom-fields surface even though the wiki includes it.
export const MAX_HEIGHT = 3;
export const MAX_AGE = 15;

const VALID_GROUND = new Set<string>([
  'webmc:sand',
  'webmc:red_sand',
  'webmc:dirt',
  'webmc:grass_block',
  'webmc:podzol',
  'webmc:mycelium',
  'webmc:coarse_dirt',
  'webmc:rooted_dirt',
  'webmc:moss_block',
  'webmc:mud',
]);

export interface PlaceQuery {
  groundBlockId: string;
  waterAdjacentToGround: boolean;
}

export function canPlace(q: PlaceQuery): boolean {
  return VALID_GROUND.has(q.groundBlockId) && q.waterAdjacentToGround;
}

export interface CaneState {
  age: number; // 0..15
}

export interface TickQuery {
  state: CaneState;
  currentHeight: number;
}

export type TickResult = 'noop' | 'age_inc' | 'grow_up';

export function randomTick(q: TickQuery): TickResult {
  if (q.currentHeight >= MAX_HEIGHT) return 'noop';
  if (q.state.age >= MAX_AGE) {
    q.state.age = 0;
    return 'grow_up';
  }
  q.state.age += 1;
  return 'age_inc';
}
