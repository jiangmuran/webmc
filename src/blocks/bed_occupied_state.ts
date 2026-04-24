export type BedPart = 'head' | 'foot';

export interface BedBlock {
  part: BedPart;
  facing: 'north' | 'south' | 'east' | 'west';
  occupied: boolean;
  color: string;
}

export function headOfBedFrom(
  foot: BedBlock,
  facing: BedBlock['facing'],
): { dx: number; dz: number } {
  switch (facing) {
    case 'north':
      return { dx: 0, dz: -1 };
    case 'south':
      return { dx: 0, dz: 1 };
    case 'east':
      return { dx: 1, dz: 0 };
    case 'west':
      return { dx: -1, dz: 0 };
  }
}

export function canSleep(
  b: BedBlock,
  isNightOrThundering: boolean,
  monstersNearby: boolean,
): boolean {
  if (b.occupied) return false;
  if (monstersNearby) return false;
  return isNightOrThundering;
}

export function occupy(b: BedBlock): BedBlock {
  return { ...b, occupied: true };
}

export function leave(b: BedBlock): BedBlock {
  return { ...b, occupied: false };
}
