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

export function dyedName(color: DyeColor): string {
  return `${color}_shulker_box`;
}

export function redye(currentId: string, color: DyeColor): string {
  if (!currentId.endsWith('shulker_box')) return currentId;
  return dyedName(color);
}

export function undye(_currentId: string): string {
  return 'shulker_box';
}
