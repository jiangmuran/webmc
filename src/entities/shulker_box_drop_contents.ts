// Shulker box drop on break. Unlike normal containers, shulker boxes
// keep contents when mined. Explosions still drop contents as items.

export interface ShulkerContents {
  items: ({ id: string; count: number } | null)[];
  color: string;
}

export interface BreakQuery {
  byExplosion: boolean;
  byCreative: boolean;
}

export interface BreakResult {
  droppedBoxItem: { id: string; nbt: ShulkerContents | null } | null;
  droppedLooseItems: { id: string; count: number }[];
}

export function onBreak(c: ShulkerContents, q: BreakQuery): BreakResult {
  if (q.byCreative) {
    return { droppedBoxItem: null, droppedLooseItems: [] };
  }
  if (q.byExplosion) {
    const loose = c.items.filter((x) => x !== null) as { id: string; count: number }[];
    return { droppedBoxItem: null, droppedLooseItems: loose };
  }
  // Mined normally: drop single item with contents preserved.
  return {
    droppedBoxItem: {
      id: `webmc:${c.color}_shulker_box`,
      nbt: c,
    },
    droppedLooseItems: [],
  };
}

// Placing a shulker box item: consume item, place block with contents.
export interface PlaceQuery {
  itemNbt: ShulkerContents | null;
}

export function onPlace(q: PlaceQuery): ShulkerContents {
  if (q.itemNbt) return q.itemNbt;
  const items: ({ id: string; count: number } | null)[] = [];
  for (let i = 0; i < 27; i++) items.push(null);
  return { items, color: 'purple' };
}
