// Enderman block-carrying. Endermen can pick up a specific whitelist
// of blocks and carry exactly one. They drop it when hurt or randomly.

const PICKUP_WHITELIST = new Set<string>([
  'webmc:grass_block',
  'webmc:dirt',
  'webmc:sand',
  'webmc:red_sand',
  'webmc:gravel',
  'webmc:clay',
  'webmc:mycelium',
  'webmc:podzol',
  'webmc:tnt',
  'webmc:cactus',
  'webmc:pumpkin',
  'webmc:melon',
  'webmc:flower',
]);

export function canPickUp(blockId: string): boolean {
  return PICKUP_WHITELIST.has(blockId);
}

export interface EndermanCarry {
  held: string | null;
}

export function tryPickup(state: EndermanCarry, blockId: string): boolean {
  if (state.held !== null) return false;
  if (!canPickUp(blockId)) return false;
  state.held = blockId;
  return true;
}

export function dropHeld(state: EndermanCarry): string | null {
  const b = state.held;
  state.held = null;
  return b;
}
