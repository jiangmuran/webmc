// Sheep natural color distribution. ~82% white, 5% each: gray, light_gray,
// black; 3% pink (rare).

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

export function breedColorFromParents(a: SheepColor, b: SheepColor): SheepColor {
  if (a === b) return a;
  return a < b ? a : b; // simplified
}
