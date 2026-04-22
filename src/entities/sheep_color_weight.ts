// Sheep natural color distribution. White 81.836%, black 5%, gray
// 5%, light_gray 5%, brown 3%, pink 0.164%.

export type SheepColor = 'white' | 'black' | 'gray' | 'light_gray' | 'brown' | 'pink';

const DISTRIBUTION: { color: SheepColor; weight: number }[] = [
  { color: 'white', weight: 0.81836 },
  { color: 'black', weight: 0.05 },
  { color: 'gray', weight: 0.05 },
  { color: 'light_gray', weight: 0.05 },
  { color: 'brown', weight: 0.03 },
  { color: 'pink', weight: 0.00164 },
];

export function rollNaturalColor(rand: () => number): SheepColor {
  let r = rand();
  for (const e of DISTRIBUTION) {
    r -= e.weight;
    if (r <= 0) return e.color;
  }
  return 'white';
}

// Breeding: mixed color = mix dye. If parents both natural (non-dyed)
// the result is random natural.
export function breedColor(a: SheepColor, b: SheepColor, rand: () => number): SheepColor {
  if (a === b) return a;
  // If mixing is not explicitly defined, yield one parent's color randomly.
  return rand() < 0.5 ? a : b;
}
