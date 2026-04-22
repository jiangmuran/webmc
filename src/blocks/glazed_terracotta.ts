// Glazed terracotta. 16 color variants produced by smelting colored
// terracotta. Unlike regular blocks, each variant has a directional
// texture pattern (like animated skulls); the top face rotates with
// placement facing.

export type GlazedColor =
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

export const GLAZED_COLORS: readonly GlazedColor[] = [
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

export function glazedBlockId(color: GlazedColor): string {
  return `webmc:${color}_glazed_terracotta`;
}

export function parseGlazedId(itemId: string): GlazedColor | null {
  const m = /^webmc:(\w+)_glazed_terracotta$/.exec(itemId);
  if (!m?.[1]) return null;
  const color = m[1];
  return GLAZED_COLORS.includes(color as GlazedColor) ? (color as GlazedColor) : null;
}

// Smelting input: colored terracotta → glazed terracotta of same color.
export function smeltInput(color: GlazedColor): string {
  return `webmc:${color}_terracotta`;
}

// Glazed terracotta doesn't stick to pistons — attempt to push returns
// false, preventing the movement.
export const GLAZED_RESISTS_PISTON = true;

// Glazed terracotta has the lowest piston-push priority (it explicitly
// cannot be moved without breaking).
export function canPistonPush(blockId: string): boolean {
  return !parseGlazedId(blockId);
}

// Hardness + blast resistance (relative to normal terracotta).
export const GLAZED_HARDNESS = 1.4;
export const GLAZED_BLAST_RESISTANCE = 1.4;
