// Shulker box dyeing. A regular shulker box crafted with any dye
// becomes that color. Re-dyeing keeps the inventory intact. Undyed
// shulker = "default" (light purple in MC).

export type ShulkerColor =
  | 'default'
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

export function shulkerBlockId(color: ShulkerColor): string {
  if (color === 'default') return 'webmc:shulker_box';
  return `webmc:${color}_shulker_box`;
}

export function parseShulkerId(itemId: string): ShulkerColor | null {
  if (itemId === 'webmc:shulker_box') return 'default';
  const m = /^webmc:(\w+)_shulker_box$/.exec(itemId);
  if (!m?.[1]) return null;
  const color = m[1];
  const valid: readonly ShulkerColor[] = [
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
  ];
  return valid.includes(color as ShulkerColor) ? (color as ShulkerColor) : null;
}

export interface DyeQuery {
  shulkerColor: ShulkerColor;
  dye: Exclude<ShulkerColor, 'default'>;
}

export interface DyeResult {
  newId: string;
  changed: boolean;
}

export function dyeShulker(q: DyeQuery): DyeResult {
  if (q.shulkerColor === q.dye) {
    return { newId: shulkerBlockId(q.shulkerColor), changed: false };
  }
  return { newId: shulkerBlockId(q.dye), changed: true };
}

export function isAnyShulker(itemId: string): boolean {
  return parseShulkerId(itemId) !== null;
}
