// Beacon beam color. The beacon emits a vertical beam; stained glass /
// stained glass pane blocks in the beam's path tint it to their color.
// Multiple colored panes blend via simple averaging.

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

const COLOR_RGB: Record<DyeColor, [number, number, number]> = {
  white: [255, 255, 255],
  orange: [249, 128, 29],
  magenta: [199, 78, 189],
  light_blue: [58, 179, 218],
  yellow: [254, 216, 61],
  lime: [128, 199, 31],
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

export function beamBaseColor(): [number, number, number] {
  return [255, 255, 255];
}

export function beamAfterGlass(
  current: [number, number, number],
  color: DyeColor,
): [number, number, number] {
  const tint = COLOR_RGB[color];
  return [
    Math.round((current[0] + tint[0]) / 2),
    Math.round((current[1] + tint[1]) / 2),
    Math.round((current[2] + tint[2]) / 2),
  ];
}

// Compute final beam color given an ordered list of glass colors from
// beacon upward.
export function finalBeamColor(colors: readonly DyeColor[]): [number, number, number] {
  let cur = beamBaseColor();
  for (const c of colors) cur = beamAfterGlass(cur, c);
  return cur;
}
