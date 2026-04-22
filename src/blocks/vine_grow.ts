// Vines. Spread along walls and ceilings toward nearby solid faces.
// Each vine block has a 4-bit face mask (N/S/E/W). Random-tick growth
// spreads to an adjacent block if a solid face is available.

export const VINE_FACE_NORTH = 1 << 0;
export const VINE_FACE_SOUTH = 1 << 1;
export const VINE_FACE_EAST = 1 << 2;
export const VINE_FACE_WEST = 1 << 3;
export const VINE_FACE_UP = 1 << 4;

export interface VineState {
  faces: number; // bitmask
}

export interface VineGrowCtx {
  current: VineState;
  solidFaces: number; // mask of neighbors that can host a vine
  roll: number;
}

// MC uses ~1/4 per random tick.
const GROW_CHANCE = 0.25;

export interface VineTickResult {
  grew: boolean;
  newFaces: number;
}

export function tickVine(ctx: VineGrowCtx): VineTickResult {
  if (ctx.roll >= GROW_CHANCE) return { grew: false, newFaces: ctx.current.faces };
  // Add any solid face that we aren't already attached to.
  const available = ctx.solidFaces & ~ctx.current.faces;
  if (available === 0) return { grew: false, newFaces: ctx.current.faces };
  // Pick lowest-bit face deterministically.
  const pick = available & -available;
  return { grew: true, newFaces: ctx.current.faces | pick };
}

export function hasFace(state: VineState, face: number): boolean {
  return (state.faces & face) !== 0;
}

export function addFace(state: VineState, face: number): void {
  state.faces |= face;
}

export function removeFace(state: VineState, face: number): void {
  state.faces &= ~face;
}

// Vines break if they no longer have ANY supported face or one above.
export function vineIsSupported(state: VineState): boolean {
  return state.faces !== 0;
}

// Climbing a vine is allowed only if the vine has a face touching a
// solid block facing the player; a hanging vine without upward support
// can still be climbed by non-creative players.
export function canClimb(state: VineState): boolean {
  return vineIsSupported(state);
}
