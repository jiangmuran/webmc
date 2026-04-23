export type Dir = 'north' | 'south' | 'east' | 'west';

export function placedFacing(playerYawDeg: number): Dir {
  const n = ((playerYawDeg % 360) + 360) % 360;
  if (n < 45 || n >= 315) return 'south';
  if (n < 135) return 'west';
  if (n < 225) return 'north';
  return 'east';
}

export function opaqueFace(): boolean {
  return true;
}

export function hopperBlocksWhenPointing(dir: Dir, hopperDir: Dir): boolean {
  return dir === hopperDir;
}
