// Dyeing leather armor + banner-washing in a water cauldron. A water
// cauldron holds 1..3 levels; each dye drop mixes with the existing dye,
// consuming 1 level per dyed item. Water-washing a leather item removes
// its color; a cauldron with 1+ level of water can do this.

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

export const DYE_RGB: Record<DyeColor, [number, number, number]> = {
  white: [255, 255, 255],
  orange: [219, 125, 62],
  magenta: [179, 80, 188],
  light_blue: [107, 138, 201],
  yellow: [254, 216, 61],
  lime: [65, 174, 56],
  pink: [243, 139, 170],
  gray: [71, 79, 82],
  light_gray: [157, 157, 151],
  cyan: [22, 156, 156],
  purple: [137, 50, 183],
  blue: [60, 68, 169],
  brown: [131, 84, 50],
  green: [93, 124, 21],
  red: [176, 46, 38],
  black: [29, 29, 33],
};

export interface CauldronState {
  contents: 'empty' | 'water' | 'lava' | 'powder_snow';
  level: 0 | 1 | 2 | 3;
}

export interface DyeLeatherQuery {
  currentColor: [number, number, number] | null;
  addedDyes: readonly DyeColor[];
}

export function mixLeatherDye(q: DyeLeatherQuery): [number, number, number] {
  const samples: [number, number, number][] = [];
  if (q.currentColor) samples.push(q.currentColor);
  for (const d of q.addedDyes) samples.push(DYE_RGB[d]);
  if (samples.length === 0) return [160, 101, 64]; // default leather
  let r = 0,
    g = 0,
    b = 0,
    maxMax = 0;
  for (const s of samples) {
    r += s[0];
    g += s[1];
    b += s[2];
    maxMax += Math.max(s[0], s[1], s[2]);
  }
  const avgMax = maxMax / samples.length;
  const n = samples.length;
  const avg: [number, number, number] = [r / n, g / n, b / n];
  const localMax = Math.max(avg[0], avg[1], avg[2]);
  const factor = localMax === 0 ? 1 : avgMax / localMax;
  return [Math.round(avg[0] * factor), Math.round(avg[1] * factor), Math.round(avg[2] * factor)];
}

export interface WashItemQuery {
  cauldron: CauldronState;
  itemHasColor: boolean;
}

export interface WashResult {
  washed: boolean;
  cauldronLevelAfter: 0 | 1 | 2 | 3;
}

export function washLeatherInCauldron(q: WashItemQuery): WashResult {
  if (q.cauldron.contents !== 'water' || q.cauldron.level < 1) {
    return { washed: false, cauldronLevelAfter: q.cauldron.level };
  }
  if (!q.itemHasColor) {
    return { washed: false, cauldronLevelAfter: q.cauldron.level };
  }
  const nextLevel = (q.cauldron.level - 1) as 0 | 1 | 2 | 3;
  return { washed: true, cauldronLevelAfter: nextLevel };
}
