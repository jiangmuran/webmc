// Mooshroom. Cow variant that drops mushrooms when sheared + gives
// mushroom stew when milked with a bowl. Lightning converts red ↔ brown
// color; suspicious stew applies an effect when made from a brown
// mooshroom.

export type MooshroomColor = 'red' | 'brown';

export interface MooshroomState {
  color: MooshroomColor;
  sheared: boolean;
}

export function makeMooshroom(color: MooshroomColor = 'red'): MooshroomState {
  return { color, sheared: false };
}

// Lightning strikes the mooshroom → swap color.
export function lightningStrikeMooshroom(state: MooshroomState): void {
  state.color = state.color === 'red' ? 'brown' : 'red';
}

// Shearing → drop 5 of the matching mushroom + convert to a cow.
export interface ShearResult {
  dropsMushrooms: readonly string[];
  convertedTo: 'cow';
}

export function shearMooshroom(state: MooshroomState): ShearResult | null {
  if (state.sheared) return null;
  state.sheared = true;
  const mushroom = state.color === 'red' ? 'webmc:red_mushroom' : 'webmc:brown_mushroom';
  return {
    dropsMushrooms: [mushroom, mushroom, mushroom, mushroom, mushroom],
    convertedTo: 'cow',
  };
}

// Milking with a bowl → mushroom stew (or suspicious stew from brown +
// a flower the mooshroom ate).
export function milkMooshroom(state: MooshroomState, lastFlower: string | null): string {
  if (state.color === 'brown' && lastFlower) {
    return 'webmc:suspicious_stew';
  }
  return 'webmc:mushroom_stew';
}
