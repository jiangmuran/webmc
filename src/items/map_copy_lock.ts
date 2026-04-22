// Maps: copy by crafting empty_map + filled_map (produces a copy with
// same exploration data); lock by using glass_pane in cartography
// table (prevents further exploration writes).

export interface MapSnapshot {
  id: number;
  exploredBits: Uint8Array;
  locked: boolean;
}

export function cloneMap(src: MapSnapshot, newId: number): MapSnapshot {
  return { id: newId, exploredBits: new Uint8Array(src.exploredBits), locked: src.locked };
}

export function lockMap(m: MapSnapshot): boolean {
  if (m.locked) return false;
  m.locked = true;
  return true;
}

// Cartography table: map + empty map → two same-id maps (copy). Returns
// null if source is not a map.
export function craftCopy(src: MapSnapshot | null, newId: number): MapSnapshot | null {
  if (!src) return null;
  return cloneMap(src, newId);
}

// Enlarging: zoom out costs 1 paper + 8 paper around (in crafting);
// here exposed as a pure predicate.
export function canEnlarge(scale: number): boolean {
  return scale < 4;
}
