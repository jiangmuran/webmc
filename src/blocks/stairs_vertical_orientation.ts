// Stairs orientation on placement. Facing = player yaw (8 dirs round
// to 4). Half (top/bottom) depends on clicked face + Y within block.

export type Facing = 'north' | 'south' | 'east' | 'west';
export type Half = 'top' | 'bottom';

export interface PlaceQuery {
  yawDeg: number; // -180..180
  clickedFace: 'top' | 'bottom' | 'side';
  clickedYInBlock: number; // 0..1
}

// Player facing from yaw angle (0 = +Z south).
export function facingFromYaw(yaw: number): Facing {
  const n = (((-yaw % 360) + 360 + 45) % 360) / 90;
  const i = Math.floor(n) & 3;
  const order = ['south', 'west', 'north', 'east'] as const;
  return order[i] ?? 'south';
}

export function halfFor(q: PlaceQuery): Half {
  if (q.clickedFace === 'top') return 'bottom';
  if (q.clickedFace === 'bottom') return 'top';
  return q.clickedYInBlock >= 0.5 ? 'top' : 'bottom';
}

export function placementFor(q: PlaceQuery): { facing: Facing; half: Half } {
  return { facing: facingFromYaw(q.yawDeg), half: halfFor(q) };
}
