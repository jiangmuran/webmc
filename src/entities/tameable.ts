// Tameable animals — wolves (bone), cats (raw fish), parrots (seeds),
// horses (mount-until-accept). Tamed pets follow + protect owner + can
// sit on command.

export type TameableKind = 'wolf' | 'cat' | 'parrot' | 'horse' | 'donkey' | 'mule' | 'llama';

export interface TameableState {
  kind: TameableKind;
  ownerId: number | null;
  sitting: boolean;
  collarColor: string; // wolf only
}

export function makeTameable(kind: TameableKind): TameableState {
  return { kind, ownerId: null, sitting: false, collarColor: 'red' };
}

const TAME_ITEMS: Record<TameableKind, readonly string[]> = {
  wolf: ['webmc:bone'],
  // 1.13+ renamed raw_fish → cod, raw_salmon → salmon. Old names were
  // never registered, so feeding cats with raw fish silently failed.
  cat: ['webmc:cod', 'webmc:salmon'],
  // Wiki: parrots tame on any seed — wheat, melon, pumpkin, beetroot
  // (and torchflower in 1.20+, not registered locally).
  parrot: ['webmc:wheat_seeds', 'webmc:melon_seeds', 'webmc:pumpkin_seeds', 'webmc:beetroot_seeds'],
  horse: [], // horses are tamed by riding, not feeding
  donkey: [],
  mule: [],
  llama: [],
};

const TAME_CHANCE: Record<TameableKind, number> = {
  wolf: 0.33,
  cat: 0.33,
  parrot: 0.33,
  horse: 0.1,
  donkey: 0.1,
  mule: 0.1,
  llama: 0.1,
};

export interface TameResult {
  tamed: boolean;
  consumed: boolean;
}

export function tryTame(
  state: TameableState,
  playerId: number,
  itemName: string,
  rng: () => number = Math.random,
): TameResult {
  if (state.ownerId !== null) return { tamed: false, consumed: false };
  if (!TAME_ITEMS[state.kind].includes(itemName)) return { tamed: false, consumed: false };
  const success = rng() < TAME_CHANCE[state.kind];
  if (success) state.ownerId = playerId;
  return { tamed: success, consumed: true };
}

// Right-click a tamed pet to toggle sit state.
export function toggleSit(state: TameableState, playerId: number): boolean {
  if (state.ownerId !== playerId) return false;
  state.sitting = !state.sitting;
  return true;
}

// Wolf collar dye.
export function dyeCollar(state: TameableState, color: string): boolean {
  if (state.kind !== 'wolf' || state.ownerId === null) return false;
  state.collarColor = color;
  return true;
}
