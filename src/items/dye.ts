// Dye system — apply dyes to leather armor (blend with existing tint),
// wool (replace outright), sheep (replace color), banner patterns, etc.

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

export const DYE_RGB: Record<DyeColor, readonly [number, number, number]> = {
  white: [249, 255, 254],
  orange: [249, 128, 29],
  magenta: [199, 78, 189],
  light_blue: [58, 179, 218],
  yellow: [254, 216, 61],
  lime: [128, 199, 31],
  pink: [243, 139, 170],
  gray: [71, 79, 82],
  light_gray: [157, 157, 151],
  cyan: [22, 156, 156],
  purple: [137, 50, 184],
  blue: [60, 68, 170],
  brown: [131, 84, 50],
  green: [94, 124, 22],
  red: [176, 46, 38],
  black: [29, 29, 33],
};

// Leather armor blending — mixes current color with new dye using MC's
// averaging formula (weighted by the total number of applied dyes).
export interface LeatherArmorState {
  color: readonly [number, number, number];
  dyesApplied: number;
}

export function makeLeatherArmor(): LeatherArmorState {
  return { color: [160, 101, 64], dyesApplied: 0 };
}

export function applyDyeToLeather(state: LeatherArmorState, dye: DyeColor): LeatherArmorState {
  const rgb = DYE_RGB[dye];
  const currentWeight = state.dyesApplied || 1;
  const total = currentWeight + 1;
  const r = Math.round((state.color[0] * currentWeight + rgb[0]) / total);
  const g = Math.round((state.color[1] * currentWeight + rgb[1]) / total);
  const b = Math.round((state.color[2] * currentWeight + rgb[2]) / total);
  return { color: [r, g, b], dyesApplied: state.dyesApplied + 1 };
}

// Simpler: replace color outright (wool, sheep, shulker box, banner base).
export function replaceColor(dye: DyeColor): readonly [number, number, number] {
  return DYE_RGB[dye];
}
