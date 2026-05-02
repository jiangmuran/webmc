// Wall variants. Walls have 5 visual "tall/low" flags (post + 4
// sides). Tall is drawn when there's a full block above the junction
// or the wall extends vertically.

export type Side = 'north' | 'south' | 'east' | 'west';

export interface WallQuery {
  hasFullAbove: boolean; // block directly above the wall center
  adjacent: Record<Side, { wall: boolean; full: boolean; fenceGate: boolean }>;
}

export interface WallShape {
  post: boolean;
  up: Record<Side, 'none' | 'low' | 'tall'>;
}

export function wallShape(q: WallQuery): WallShape {
  const connect: Record<Side, boolean> = {
    north: q.adjacent.north.wall || q.adjacent.north.full || q.adjacent.north.fenceGate,
    south: q.adjacent.south.wall || q.adjacent.south.full || q.adjacent.south.fenceGate,
    east: q.adjacent.east.wall || q.adjacent.east.full || q.adjacent.east.fenceGate,
    west: q.adjacent.west.wall || q.adjacent.west.full || q.adjacent.west.fenceGate,
  };

  const tallPreferred = q.hasFullAbove;
  const straightNS = connect.north && connect.south && !connect.east && !connect.west;
  const straightEW = connect.east && connect.west && !connect.north && !connect.south;
  const isStraight = straightNS || straightEW;

  // Wiki (minecraft.wiki/w/Wall block-states): "up — when set to false,
  // the post column is replaced by an upper portion of the wall,
  // leveling out walls that connect on opposite sides only (north and
  // south, or east and west). Otherwise, walls have a vertical post
  // column." So up=false ONLY for straight pairs; every other config —
  // including a single-side connection — keeps the post. Old condition
  // omitted the 1-connection case, so a wall with only one neighbor
  // rendered without its post.
  const post = tallPreferred || !isStraight;
  const up: Record<Side, 'none' | 'low' | 'tall'> = {
    north: 'none',
    south: 'none',
    east: 'none',
    west: 'none',
  };
  for (const s of ['north', 'south', 'east', 'west'] as const) {
    if (!connect[s]) continue;
    up[s] = tallPreferred ? 'tall' : 'low';
  }
  return { post, up };
}
