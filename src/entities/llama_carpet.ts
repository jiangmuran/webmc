// Llama decorations. Tamed llamas can wear one of 16 colored carpets
// (the wool carpet block, not a banner). They can also carry chests when
// tamed, giving them a 3/6/9/12/15-slot container depending on strength.

export type CarpetColor =
  | 'white'
  | 'orange'
  | 'magenta'
  | 'light_blue'
  | 'yellow'
  | 'lime'
  | 'pink'
  | 'gray'
  | 'light_gray'
  | 'cyan'
  | 'purple'
  | 'blue'
  | 'brown'
  | 'green'
  | 'red'
  | 'black';

export interface LlamaState {
  id: number;
  tamed: boolean;
  strength: 1 | 2 | 3 | 4 | 5; // inherited breed attribute
  carpet: CarpetColor | null;
  chestAttached: boolean;
}

export function makeLlama(id: number, strength: LlamaState['strength'] = 3): LlamaState {
  return { id, tamed: false, strength, carpet: null, chestAttached: false };
}

export interface ApplyCarpetResult {
  accepted: boolean;
  previousCarpet: CarpetColor | null;
}

export function applyCarpet(state: LlamaState, color: CarpetColor): ApplyCarpetResult {
  if (!state.tamed) return { accepted: false, previousCarpet: state.carpet };
  const prev = state.carpet;
  state.carpet = color;
  return { accepted: true, previousCarpet: prev };
}

export interface AttachChestResult {
  accepted: boolean;
  slotCount: number;
}

export function attachChest(state: LlamaState): AttachChestResult {
  if (!state.tamed || state.chestAttached) return { accepted: false, slotCount: 0 };
  state.chestAttached = true;
  return { accepted: true, slotCount: slotCountForStrength(state.strength) };
}

export function slotCountForStrength(s: LlamaState['strength']): number {
  // MC: 3, 6, 9, 12, 15 by strength 1..5
  return s * 3;
}

// A caravan head (lead-holding trader) is followed by up to 9 pack llamas;
// this helper tracks the leader id chain for rendering.
export interface CaravanState {
  leaderId: number;
  members: number[];
}

export function addToCaravan(cv: CaravanState, id: number): void {
  if (cv.members.length >= 9) return;
  if (cv.members.includes(id) || id === cv.leaderId) return;
  cv.members.push(id);
}

export function leaveCaravan(cv: CaravanState, id: number): void {
  cv.members = cv.members.filter((m) => m !== id);
}
