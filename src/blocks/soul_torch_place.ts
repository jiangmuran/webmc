export const SOUL_TORCH_LIGHT = 10;
export const PIGLIN_REPEL_RADIUS = 8;

export function lightLevel(): number {
  return SOUL_TORCH_LIGHT;
}

export function repelsPiglins(): boolean {
  return true;
}

export function piglinAvoidRadius(): number {
  return PIGLIN_REPEL_RADIUS;
}

export function canPlaceOnWallOrFloor(surface: 'wall' | 'floor' | 'ceiling'): boolean {
  return surface !== 'ceiling';
}
