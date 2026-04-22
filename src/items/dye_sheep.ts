// Dyeing sheep. Right-clicking a sheep with a dye sets its color.
// Shorn sheep regrow wool on grass (eat grass → regrow).

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

export interface Sheep {
  color: DyeColor;
  sheared: boolean;
}

export function dyeSheep(s: Sheep, color: DyeColor): boolean {
  if (s.color === color) return false;
  s.color = color;
  return true;
}

export function shear(s: Sheep): { drops: number; color: DyeColor } | null {
  if (s.sheared) return null;
  s.sheared = true;
  return { drops: 1 + Math.floor(Math.random() * 3), color: s.color };
}

// Breeding: mixing two primary dyes on sheep can yield a "mixed" child
// color per the dye color-mix table. Non-matching colors → white.
const MIX: Record<string, DyeColor> = {
  'red+yellow': 'orange',
  'yellow+red': 'orange',
  'red+white': 'pink',
  'white+red': 'pink',
  'blue+red': 'purple',
  'red+blue': 'purple',
  'blue+green': 'cyan',
  'green+blue': 'cyan',
  'white+black': 'gray',
  'black+white': 'gray',
};

export function breedColor(a: DyeColor, b: DyeColor): DyeColor {
  if (a === b) return a;
  return MIX[`${a}+${b}`] ?? 'white';
}

// Grass-eating regrow: sheep eats grass block below → regrows wool.
export function eatGrassRegrow(s: Sheep): boolean {
  if (!s.sheared) return false;
  s.sheared = false;
  return true;
}
