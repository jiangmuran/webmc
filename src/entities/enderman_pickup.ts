// Enderman pickup mechanic. An enderman carries one block at a time;
// picks up if it wanders onto a random "carryable" block; places when
// it teleports. Limited set of carryable blocks matching MC.

const CARRYABLE = new Set<string>([
  'webmc:grass_block',
  'webmc:dirt',
  'webmc:gravel',
  'webmc:sand',
  'webmc:clay',
  'webmc:mycelium',
  'webmc:podzol',
  'webmc:pumpkin',
  'webmc:melon',
  'webmc:netherrack',
  'webmc:cactus',
  'webmc:tnt',
  'webmc:flower_red',
  'webmc:flower_yellow',
  'webmc:oak_log',
  'webmc:dirt_path',
  'webmc:mud',
]);

export interface EndermanPickupState {
  carrying: string | null;
}

export function makeEndermanPickup(): EndermanPickupState {
  return { carrying: null };
}

export function canPickup(blockName: string): boolean {
  return CARRYABLE.has(blockName);
}

export interface PickupResult {
  picked: boolean;
}

export function tryPickup(
  state: EndermanPickupState,
  blockName: string,
  rng: () => number = Math.random,
): PickupResult {
  if (state.carrying !== null) return { picked: false };
  if (!canPickup(blockName)) return { picked: false };
  if (rng() < 0.03) {
    state.carrying = blockName;
    return { picked: true };
  }
  return { picked: false };
}

export interface PlaceResult {
  placed: boolean;
  placedBlock: string | null;
}

export function tryPlace(state: EndermanPickupState, rng: () => number = Math.random): PlaceResult {
  if (state.carrying === null) return { placed: false, placedBlock: null };
  if (rng() < 0.05) {
    const placed = state.carrying;
    state.carrying = null;
    return { placed: true, placedBlock: placed };
  }
  return { placed: false, placedBlock: null };
}
