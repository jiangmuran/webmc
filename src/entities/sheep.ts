// Sheep wool regrowth. Shearing drops 1-3 wool + removes coat; the
// sheep regrows after eating grass (which replaces grass_block with
// dirt underneath).

export type SheepWool =
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

export interface SheepState {
  color: SheepWool;
  sheared: boolean;
}

export function makeSheep(color: SheepWool = 'white'): SheepState {
  return { color, sheared: false };
}

export interface ShearResult {
  drops: readonly string[];
}

export function shearSheep(state: SheepState, rng: () => number = Math.random): ShearResult {
  if (state.sheared) return { drops: [] };
  state.sheared = true;
  const count = 1 + Math.floor(rng() * 3);
  const woolName = `webmc:wool_${state.color}`;
  return { drops: Array.from({ length: count }, () => woolName) };
}

// Eating grass regrows the coat. Caller turns the grass block into dirt.
export function eatGrass(state: SheepState): boolean {
  if (!state.sheared) return false;
  state.sheared = false;
  return true;
}

// Dyeing: right-click with a dye item to change coat color.
export function dyeSheep(state: SheepState, color: SheepWool): boolean {
  if (state.color === color) return false;
  state.color = color;
  return true;
}
