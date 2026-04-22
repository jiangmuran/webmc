// End portal frame. 12 frames arranged in a 4x4 ring (corners empty).
// Each needs an Eye of Ender to complete the portal. When all 12 filled,
// the 3x3 interior becomes active end portal blocks.

export interface FrameCell {
  hasEye: boolean;
  facing: 'north' | 'south' | 'east' | 'west';
}

export interface EndPortalStructure {
  frames: FrameCell[]; // 12 ordered clockwise from N
}

export function makeEmpty(): EndPortalStructure {
  return {
    frames: Array.from({ length: 12 }, () => ({ hasEye: false, facing: 'north' })),
  };
}

export function placeEye(s: EndPortalStructure, index: number): boolean {
  if (index < 0 || index >= 12) return false;
  const f = s.frames[index];
  if (!f || f.hasEye) return false;
  f.hasEye = true;
  return true;
}

export function isComplete(s: EndPortalStructure): boolean {
  return s.frames.every((f) => f.hasEye);
}

export function completedFraction(s: EndPortalStructure): number {
  const filled = s.frames.filter((f) => f.hasEye).length;
  return filled / s.frames.length;
}

// Once active, portal block coords: a 3x3 area inside the frame ring.
export const PORTAL_INNER_SIZE = 3;

export function interiorBlockCount(): number {
  return PORTAL_INNER_SIZE * PORTAL_INNER_SIZE;
}
