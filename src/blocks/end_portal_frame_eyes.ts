// End portal frame. Wiki (minecraft.wiki/w/End_Portal): 12 frames
// arranged as a 5×5 outer ring around a 3×3 inner space, with the
// 4 corner positions of the outer ring left empty. Each frame
// accepts an Eye of Ender; when all 12 are filled (and facing
// inward), the 3×3 interior becomes active end-portal blocks.
// Old comment "4x4 ring" was a coordinate misdescription —
// 12 frames don't fit in a 4×4 ring (16 - 4 corners = 12 fits 5×5
// minus corners, NOT 4×4).

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
