// Sugar cane. Grows on sand/dirt/grass blocks adjacent to water, up to
// 3 stalks tall. Random tick: 1 age++; at age 16, grows up (if height<3).

export const MAX_HEIGHT = 3;
export const MAX_AGE = 15;

const VALID_GROUND = new Set<string>([
  'webmc:sand',
  'webmc:red_sand',
  'webmc:dirt',
  'webmc:grass_block',
  'webmc:podzol',
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
