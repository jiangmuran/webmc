export type Dir = 'up' | 'down' | 'north' | 'south' | 'east' | 'west';

export const EJECT_VELOCITY = 0.3;

export function ejectedVelocity(dir: Dir): { vx: number; vy: number; vz: number } {
  switch (dir) {
    case 'up':
      return { vx: 0, vy: EJECT_VELOCITY, vz: 0 };
    case 'down':
      return { vx: 0, vy: -EJECT_VELOCITY, vz: 0 };
    case 'north':
      return { vx: 0, vy: 0, vz: -EJECT_VELOCITY };
    case 'south':
      return { vx: 0, vy: 0, vz: EJECT_VELOCITY };
    case 'east':
      return { vx: EJECT_VELOCITY, vy: 0, vz: 0 };
    case 'west':
      return { vx: -EJECT_VELOCITY, vy: 0, vz: 0 };
  }
}

export function slotsIn(): number {
  return 9;
}
