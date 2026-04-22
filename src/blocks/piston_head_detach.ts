// Piston head detachment. If a piston body is broken while extended,
// the head block is also removed and drops the piston as an item.

export interface PistonHead {
  bodyPos: { x: number; y: number; z: number };
  direction: 'up' | 'down' | 'north' | 'south' | 'east' | 'west';
  sticky: boolean;
}

export function headPosFor(h: PistonHead): { x: number; y: number; z: number } {
  const delta = stepFor(h.direction);
  return {
    x: h.bodyPos.x + delta.x,
    y: h.bodyPos.y + delta.y,
    z: h.bodyPos.z + delta.z,
  };
}

function stepFor(d: PistonHead['direction']): { x: number; y: number; z: number } {
  switch (d) {
    case 'up':
      return { x: 0, y: 1, z: 0 };
    case 'down':
      return { x: 0, y: -1, z: 0 };
    case 'north':
      return { x: 0, y: 0, z: -1 };
    case 'south':
      return { x: 0, y: 0, z: 1 };
    case 'east':
      return { x: 1, y: 0, z: 0 };
    case 'west':
      return { x: -1, y: 0, z: 0 };
  }
}

// Break the body: also removes head, drops item.
export interface BreakBodyResult {
  removeHeadAt: { x: number; y: number; z: number };
  dropItem: 'webmc:piston' | 'webmc:sticky_piston';
}

export function onBodyBroken(h: PistonHead): BreakBodyResult {
  return {
    removeHeadAt: headPosFor(h),
    dropItem: h.sticky ? 'webmc:sticky_piston' : 'webmc:piston',
  };
}

// Break the head: also remove body, no item drop (body becomes air).
export function onHeadBroken(h: PistonHead): { removeBodyAt: { x: number; y: number; z: number } } {
  return { removeBodyAt: h.bodyPos };
}
