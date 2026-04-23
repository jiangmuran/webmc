// Block facing/axis helpers. Handles horizontal facings, axis (x/y/z),
// and placement from player-facing yaw+pitch.

export type Facing = 'north' | 'south' | 'east' | 'west' | 'up' | 'down';
export type Axis = 'x' | 'y' | 'z';

export function facingFromYaw(yawDeg: number): Facing {
  const r = ((yawDeg % 360) + 360) % 360;
  if (r < 45 || r >= 315) return 'south';
  if (r < 135) return 'west';
  if (r < 225) return 'north';
  return 'east';
}

export function facingFromClickNormal(nx: number, ny: number, nz: number): Facing {
  const ax = Math.abs(nx);
  const ay = Math.abs(ny);
  const az = Math.abs(nz);
  if (ay > ax && ay > az) return ny > 0 ? 'up' : 'down';
  if (ax > az) return nx > 0 ? 'east' : 'west';
  return nz > 0 ? 'south' : 'north';
}

export function axisOf(f: Facing): Axis {
  if (f === 'up' || f === 'down') return 'y';
  if (f === 'east' || f === 'west') return 'x';
  return 'z';
}

export function oppositeOf(f: Facing): Facing {
  const M: Record<Facing, Facing> = {
    north: 'south',
    south: 'north',
    east: 'west',
    west: 'east',
    up: 'down',
    down: 'up',
  };
  return M[f];
}
