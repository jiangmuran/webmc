// Crafter block. When powered, crafts from its 9-slot grid to the
// output queue. Locked slots prevent the crafter from putting items
// into certain positions when filled via hopper.

export interface CrafterSlot {
  item: { id: string; count: number } | null;
  locked: boolean;
}

export interface Crafter {
  slots: CrafterSlot[]; // 9
  outputQueue: { id: string; count: number }[];
  powered: boolean;
  craftedSinceLastPulse: number;
}

export function makeCrafter(): Crafter {
  return {
    slots: Array.from({ length: 9 }, () => ({ item: null, locked: false })),
    outputQueue: [],
    powered: false,
    craftedSinceLastPulse: 0,
  };
}

export interface PulseQuery {
  resolveRecipe: (grid: (string | null)[]) => { id: string; count: number } | null;
}

export function onPowerRise(c: Crafter, q: PulseQuery): boolean {
  const grid = c.slots.map((s) => s.item?.id ?? null);
  const recipe = q.resolveRecipe(grid);
  if (!recipe) return false;
  for (const s of c.slots) {
    if (s.item && s.item.count > 0) {
      s.item.count -= 1;
      if (s.item.count <= 0) s.item = null;
    }
  }
  c.outputQueue.push(recipe);
  c.craftedSinceLastPulse += 1;
  return true;
}

export function popOutput(c: Crafter): { id: string; count: number } | null {
  return c.outputQueue.shift() ?? null;
}

// Comparator output: based on # filled slots.
export function comparatorOutput(c: Crafter): number {
  const filled = c.slots.filter((s) => s.item !== null).length;
  if (filled === 0) return 0;
  return Math.min(9, filled);
}

export function lockSlot(c: Crafter, index: number): boolean {
  if (index < 0 || index >= 9) return false;
  const s = c.slots[index];
  if (!s) return false;
  s.locked = true;
  return true;
}
