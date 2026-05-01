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

// Wiki (minecraft.wiki/w/Shulker_Box): "A dyed shulker box can be
// re-dyed to a different color." Note that re-dyeing replaces the
// existing color; it does NOT (and per wiki cannot) be returned to
// the plain undyed variant. The legacy `undye()` export silently
// returned plain — wiki-incorrect — and has been removed.
export function redye(currentId: string, color: DyeColor): string {
  if (!currentId.endsWith('shulker_box')) return currentId;
  return dyedName(color);
}
