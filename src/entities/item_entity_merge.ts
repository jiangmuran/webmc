// Dropped-item entity merging. Items with the same id + metadata within
// 0.5 blocks of each other merge into a single stack (up to maxStackSize).
// Merging resets the despawn timer to the older value so the combined
// entity doesn't get infinite life.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface DroppedItem {
  id: number;
  itemId: string;
  count: number;
  damage: number;
  position: Vec3;
  velocity: Vec3;
  ageSec: number;
}

const MERGE_DISTANCE = 0.5;
const MERGE_DISTANCE_SQ = MERGE_DISTANCE * MERGE_DISTANCE;

export interface StackLimitLookup {
  maxStackSize: (itemId: string) => number;
}

function withinMerge(a: DroppedItem, b: DroppedItem): boolean {
  if (a.itemId !== b.itemId) return false;
  if (a.damage !== b.damage) return false;
  const dx = a.position.x - b.position.x;
  const dy = a.position.y - b.position.y;
  const dz = a.position.z - b.position.z;
  return dx * dx + dy * dy + dz * dz <= MERGE_DISTANCE_SQ;
}

// Attempt to merge `incoming` into any of `candidates`. Returns the merged
// parent (or `incoming` if no merge). Mutates the parent's count.
export function mergeInto(
  incoming: DroppedItem,
  candidates: readonly DroppedItem[],
  limits: StackLimitLookup,
): DroppedItem {
  for (const c of candidates) {
    if (c.id === incoming.id) continue;
    if (!withinMerge(c, incoming)) continue;
    const cap = limits.maxStackSize(c.itemId);
    const room = cap - c.count;
    if (room <= 0) continue;
    const take = Math.min(room, incoming.count);
    c.count += take;
    incoming.count -= take;
    c.ageSec = Math.min(c.ageSec, incoming.ageSec);
    if (incoming.count === 0) return c;
  }
  return incoming;
}

// Compact a list by repeatedly merging pairs. Stops when no more merges.
// Returns the filtered list (excluding fully-consumed entries).
export function compactDroppedItems(items: DroppedItem[], limits: StackLimitLookup): DroppedItem[] {
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < items.length; i++) {
      const a = items[i];
      if (!a || a.count <= 0) continue;
      for (let j = i + 1; j < items.length; j++) {
        const b = items[j];
        if (!b || b.count <= 0) continue;
        if (!withinMerge(a, b)) continue;
        const cap = limits.maxStackSize(a.itemId);
        const room = cap - a.count;
        if (room <= 0) continue;
        const take = Math.min(room, b.count);
        a.count += take;
        b.count -= take;
        a.ageSec = Math.min(a.ageSec, b.ageSec);
        changed = true;
      }
    }
  }
  return items.filter((it) => it.count > 0);
}
