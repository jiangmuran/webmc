// End portal frame. 12 frames in a 3×3 hollow square (with 4 corners
// skipped). Each frame accepts one eye-of-ender; when all 12 frames
// have eyes AND face inward correctly, the end portal activates.

export type Facing = 'north' | 'south' | 'east' | 'west';

export interface EndPortalFrame {
  facing: Facing; // must face inward to the 3×3 hollow center
  hasEye: boolean;
}

// A full end portal needs 12 frames placed in the ring around a 3×3
// center. Returns the expected facing for a frame at a given offset
// relative to the portal's inner origin (0..2, 0..2).
export interface FramePosition {
  xOffset: number; // 0..2 from inner origin
  zOffset: number;
}

export function expectedFrameFacing(pos: FramePosition): Facing | null {
  // Outer ring positions.
  const { xOffset, zOffset } = pos;
  // Corners skipped.
  if ((xOffset === -1 || xOffset === 3) && (zOffset === -1 || zOffset === 3)) return null;
  if (xOffset === -1) return 'east';
  if (xOffset === 3) return 'west';
  if (zOffset === -1) return 'south';
  if (zOffset === 3) return 'north';
  return null; // inside ring
}

// All 12 ring positions.
export const FRAME_POSITIONS: readonly FramePosition[] = [
  { xOffset: -1, zOffset: 0 },
  { xOffset: -1, zOffset: 1 },
  { xOffset: -1, zOffset: 2 },
  { xOffset: 3, zOffset: 0 },
  { xOffset: 3, zOffset: 1 },
  { xOffset: 3, zOffset: 2 },
  { xOffset: 0, zOffset: -1 },
  { xOffset: 1, zOffset: -1 },
  { xOffset: 2, zOffset: -1 },
  { xOffset: 0, zOffset: 3 },
  { xOffset: 1, zOffset: 3 },
  { xOffset: 2, zOffset: 3 },
];

export interface PortalCheckQuery {
  frames: readonly { pos: FramePosition; frame: EndPortalFrame }[];
}

export interface PortalCheckResult {
  allPresent: boolean;
  allEyed: boolean;
  allFacingInward: boolean;
  active: boolean;
}

export function checkPortal(q: PortalCheckQuery): PortalCheckResult {
  const provided = new Map(
    q.frames.map((f) => [`${f.pos.xOffset.toString()},${f.pos.zOffset.toString()}`, f]),
  );
  let allPresent = true;
  let allEyed = true;
  let allFacingInward = true;
  for (const p of FRAME_POSITIONS) {
    const key = `${p.xOffset.toString()},${p.zOffset.toString()}`;
    const entry = provided.get(key);
    if (!entry) {
      allPresent = false;
      allEyed = false;
      allFacingInward = false;
      break;
    }
    if (!entry.frame.hasEye) allEyed = false;
    const expected = expectedFrameFacing(p);
    if (expected !== entry.frame.facing) allFacingInward = false;
  }
  return {
    allPresent,
    allEyed,
    allFacingInward,
    active: allPresent && allEyed && allFacingInward,
  };
}

// Inserting an eye: consumes one eye, sets hasEye true. Returns whether
// this insertion activated the portal.
export function insertEye(frame: EndPortalFrame): boolean {
  if (frame.hasEye) return false;
  frame.hasEye = true;
  return true;
}
