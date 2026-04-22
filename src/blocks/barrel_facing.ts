// Barrel facing. Placed so its open face points away from the player.
// A barrel is a 27-slot container (like a single chest) with no
// adjacency merge.

export type Facing = 'up' | 'down' | 'north' | 'south' | 'east' | 'west';

// Opposite to whatever face the player clicked when placing.
export function facingForPlacement(playerLook: Facing): Facing {
  switch (playerLook) {
    case 'up':
      return 'down';
    case 'down':
      return 'up';
    case 'north':
      return 'south';
    case 'south':
      return 'north';
    case 'east':
      return 'west';
    case 'west':
      return 'east';
  }
}

export interface Barrel {
  facing: Facing;
  open: boolean;
  slots: (string | null)[]; // 27
}

export const BARREL_SIZE = 27;

export function makeBarrel(facing: Facing): Barrel {
  return {
    facing,
    open: false,
    slots: Array.from<string | null>({ length: BARREL_SIZE }).fill(null),
  };
}

export function openBarrel(b: Barrel, obstructed: boolean): 'opened' | 'blocked' {
  if (obstructed) return 'blocked';
  b.open = true;
  return 'opened';
}

export function closeBarrel(b: Barrel): void {
  b.open = false;
}
