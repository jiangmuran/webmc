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

export function onShear(s: SheepState): { newSheep: SheepState; drops: readonly string[] } {
  if (!s.hasWool) return { newSheep: s, drops: [] };
  const count = 1 + Math.floor(Math.random() * 0) + 1;
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
