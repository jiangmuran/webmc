// Fox behavior. Picks up dropped items (holds in mouth), steals sweet
// berries from bushes, flees from players unless sitting/tamed.

export interface Fox {
  heldItemId: string | null;
  tamed: boolean;
  ownerId: string | null;
  sitting: boolean;
  hp: number;
}

export function canPickUp(f: Fox): boolean {
  return f.heldItemId === null;
}

export function tryPickup(f: Fox, itemId: string): boolean {
  if (!canPickUp(f)) return false;
  f.heldItemId = itemId;
  return true;
}

export function dropHeld(f: Fox): string | null {
  const i = f.heldItemId;
  f.heldItemId = null;
  return i;
}

// Foxes eat held food (golden apple restores HP).
export interface EatQuery {
  itemId: string;
}

const FOX_FOOD: Record<string, number> = {
  'webmc:sweet_berries': 0,
  'webmc:glow_berries': 0,
  'webmc:chicken': 0,
  'webmc:rabbit': 0,
  'webmc:cooked_chicken': 0,
  'webmc:cooked_rabbit': 0,
  'webmc:golden_apple': 5,
  'webmc:enchanted_golden_apple': 10,
};

export function tryEatHeld(f: Fox): { ate: boolean; hpGain: number } {
  if (f.heldItemId === null) return { ate: false, hpGain: 0 };
  if (!(f.heldItemId in FOX_FOOD)) return { ate: false, hpGain: 0 };
  const gain = FOX_FOOD[f.heldItemId] ?? 0;
  f.heldItemId = null;
  return { ate: true, hpGain: gain };
}

// Only non-tamed foxes steal berries.
export interface BerryStealQuery {
  bushBerries: number;
  fox: Fox;
}

export function stealBerry(q: BerryStealQuery): { berry: boolean; remainingOnBush: number } {
  if (q.fox.tamed) return { berry: false, remainingOnBush: q.bushBerries };
  if (q.bushBerries <= 0) return { berry: false, remainingOnBush: 0 };
  return { berry: true, remainingOnBush: q.bushBerries - 1 };
}
