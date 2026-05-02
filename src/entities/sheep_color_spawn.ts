// Sheep natural color distribution. ~82% white, 5% each: gray, light_gray,
// black; 3% pink (rare).
import { mixedOffspring, type Color as MixColor } from './sheep_wool_color_mix';

export type SheepColor =
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

const WEIGHTS: { color: SheepColor; weight: number }[] = [
  { color: 'white', weight: 82 },
  { color: 'black', weight: 5 },
  { color: 'gray', weight: 5 },
  { color: 'light_gray', weight: 5 },
  { color: 'brown', weight: 3 },
  { color: 'pink', weight: 0.16 },
];

export function rollSpawnColor(rand: () => number): SheepColor {
  const total = WEIGHTS.reduce((s, w) => s + w.weight, 0);
  let r = rand() * total;
  for (const w of WEIGHTS) {
    if (r < w.weight) return w.color;
    r -= w.weight;
  }
  return 'white';
}

export function dyeWithDye(dye: SheepColor): SheepColor {
  return dye;
}

// Wiki (minecraft.wiki/w/Sheep#Breeding): "If the colors of the
// parents can be combined to make another color (similar to dyes),
// the baby is that color. Otherwise, the baby has the color of one
// of its parents at random." Old `a < b ? a : b` was a deterministic
// alphabetical pick — neither the dye-mix outcome nor the random
// fallback the wiki describes. Sibling sheep_wool_color_mix.ts
// already implements the dye mix; this delegates to it for the
// known dye combinations and falls back to a random parent color
// for unmapped pairs.
export function breedColorFromParents(
  a: SheepColor,
  b: SheepColor,
  rng: () => number = Math.random,
): SheepColor {
  if (a === b) return a;
  const mixed = mixedOffspring(a as MixColor, b as MixColor) as SheepColor;
  // mixedOffspring returns `a` as fallback when no mix exists; in that
  // case wiki says random parent — ignore the fallback and roll.
  if (mixed !== a) return mixed;
  return rng() < 0.5 ? a : b;
}
