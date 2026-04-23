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

export const DEFAULT_COLLAR: DyeColor = 'red';

export function collarColor(applied?: DyeColor): DyeColor {
  return applied ?? DEFAULT_COLLAR;
}

export function changesOnDye(color: DyeColor): DyeColor {
  return color;
}
