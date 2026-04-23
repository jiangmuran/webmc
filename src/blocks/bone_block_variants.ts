export interface BoneBlockState {
  axis: 'x' | 'y' | 'z';
}

export function placedAxisFromFace(
  face: 'up' | 'down' | 'north' | 'south' | 'east' | 'west',
): BoneBlockState['axis'] {
  if (face === 'up' || face === 'down') return 'y';
  if (face === 'north' || face === 'south') return 'z';
  return 'x';
}

export function dropsBoneMeal(rng: () => number): number {
  return 1 + Math.floor(rng() * 3);
}

export function noteBlockInstrument(): string {
  return 'xylophone';
}
