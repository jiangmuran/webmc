// Dye mixing from primary + primary or primary + secondary crafting.

export type DyeColor =
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

const RECIPES: Record<string, DyeColor> = {
  'red+yellow': 'orange',
  'red+white': 'pink',
  'red+pink': 'pink',
  'pink+red': 'pink',
  'blue+green': 'cyan',
  'blue+red': 'purple',
  'red+blue': 'purple',
  'blue+white': 'light_blue',
  'black+white': 'gray',
  'gray+white': 'light_gray',
  'yellow+blue': 'green',
  'red+yellow+blue': 'brown',
  'magenta+pink': 'magenta',
  'purple+pink': 'magenta',
  'red+blue+pink': 'magenta',
  'green+white': 'lime',
};

export function craftDye(inputs: DyeColor[]): DyeColor | null {
  const key = [...inputs].sort().join('+');
  const sorted = Object.keys(RECIPES).find((k) => k.split('+').sort().join('+') === key);
  return sorted ? (RECIPES[sorted] ?? null) : null;
}

export function isPrimary(c: DyeColor): boolean {
  return c === 'red' || c === 'yellow' || c === 'blue' || c === 'white' || c === 'black';
}
