export const WOOL_COLORS = [
  'white',
  'orange',
  'magenta',
  'light_blue',
  'yellow',
  'lime',
  'pink',
  'gray',
  'light_gray',
  'cyan',
  'purple',
  'blue',
  'brown',
  'green',
  'red',
  'black',
] as const;

export type WoolColor = (typeof WOOL_COLORS)[number];

export interface SheepState {
  color: WoolColor;
  hasWool: boolean;
  eatingGrassTicks: number;
}

// Wiki (minecraft.wiki/w/Sheep): "Sheared sheep drop 1-3 wool of its
// color. The wool regrows after the sheep eats grass." Old expression
// `1 + Math.floor(Math.random() * 0) + 1` always evaluated to 2 — the
// `* 0` zeroed the random factor, so every shear yielded exactly 2
// wool instead of the wiki-canonical 1-3 range. Sibling
// sheep_shear_regrow.ts uses the correct `1 + floor(rand() * 3)`.
export function onShear(
  s: SheepState,
  rand: () => number = Math.random,
): { newSheep: SheepState; drops: readonly string[] } {
  if (!s.hasWool) return { newSheep: s, drops: [] };
  const count = 1 + Math.floor(rand() * 3);
  return {
    newSheep: { ...s, hasWool: false },
    drops: new Array<string>(count).fill(`${s.color}_wool`),
  };
}

export function eatingGrassRegrowsWool(s: SheepState): {
  regrows: boolean;
  nextEatingTicks: number;
} {
  if (s.hasWool) return { regrows: false, nextEatingTicks: 0 };
  return { regrows: true, nextEatingTicks: 40 };
}

export function applyDye(s: SheepState, color: WoolColor): SheepState {
  if (!s.hasWool) return s;
  return { ...s, color };
}
