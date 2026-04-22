// Item frame. Holds one item; right-click to rotate (8 steps for maps,
// 8 for other items, but only renders 8 distinct rotations). Breaking
// drops the frame + held item.

export const MAX_ROTATIONS = 8;

export interface ItemFrame {
  itemId: string | null;
  rotation: number; // 0..7
  glowing: boolean;
  invisible: boolean;
}

export function makeFrame(glowing = false, invisible = false): ItemFrame {
  return { itemId: null, rotation: 0, glowing, invisible };
}

export function place(f: ItemFrame, itemId: string): boolean {
  if (f.itemId !== null) return false;
  f.itemId = itemId;
  return true;
}

export function remove(f: ItemFrame): string | null {
  const it = f.itemId;
  f.itemId = null;
  f.rotation = 0;
  return it;
}

export function rotate(f: ItemFrame): boolean {
  if (f.itemId === null) return false;
  f.rotation = (f.rotation + 1) % MAX_ROTATIONS;
  return true;
}

export function comparatorOutput(f: ItemFrame): number {
  if (f.itemId === null) return 0;
  // 1..8 mapped to 1..15 is approx: rotation+1 for simple signal.
  return f.rotation + 1;
}
