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

// Wiki (minecraft.wiki/w/Sheep#Breeding): "If the parents have
// compatible wool colors (meaning that the corresponding dye items
// could be combined into a third dye color), the resulting baby sheep
// inherits a mix of their colors (e.g., blue sheep + white sheep =
// light blue baby sheep). If the dye colors cannot normally be mixed,
// the baby sheep spawns with the same color as one of the parents,
// chosen randomly."
//
// Old table covered only 5 mix pairs and silently fell back to 'white'
// for everything else. Two corrections:
//   1. Added the rest of the wiki's sheep-breeding mix table:
//      white+gray=light_gray, white+green=lime, white+blue=light_blue,
//      pink+purple=magenta.
//   2. Non-mixable pairs now return one parent at random rather than
//      'white'. (The old fallback meant red × purple parents always
//      produced a white lamb — vanilla returns red OR purple.)
const MIX: Record<string, DyeColor> = {
  'red+yellow': 'orange',
  'red+white': 'pink',
  'blue+red': 'purple',
  'blue+green': 'cyan',
  'black+white': 'gray',
  'gray+white': 'light_gray',
  'green+white': 'lime',
  'blue+white': 'light_blue',
  'pink+purple': 'magenta',
};

function mixKey(a: DyeColor, b: DyeColor): string {
  return [a, b].sort().join('+');
}

export function breedColor(a: DyeColor, b: DyeColor, rng: () => number = Math.random): DyeColor {
  if (a === b) return a;
  const mix = MIX[mixKey(a, b)];
  if (mix !== undefined) return mix;
  return rng() < 0.5 ? a : b;
}

// Grass-eating regrow: sheep eats grass block below → regrows wool.
export function eatGrassRegrow(s: Sheep): boolean {
  if (!s.sheared) return false;
  s.sheared = false;
  return true;
}
