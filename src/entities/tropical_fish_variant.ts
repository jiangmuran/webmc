// Tropical fish variants: 22 named + procedural 2-byte variant NBT.

export const SHAPES = ['flopper', 'stripey', 'glitter', 'blockfish', 'betty', 'clayfish'] as const;
export type FishShape = (typeof SHAPES)[number];

// Wiki (minecraft.wiki/w/Tropical_Fish): tropical fish use the full
// 16 dye-color palette for body + pattern. Old list had only 8 of
// them, so half the wiki variants couldn't be encoded.
export type FishColor =
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

export interface FishVariant {
  shape: FishShape;
  pattern: number;
  bodyColor: FishColor;
  patternColor: FishColor;
}

export function encodeVariant(v: FishVariant): number {
  const shapeIdx = SHAPES.indexOf(v.shape);
  const bodyIdx = colorIndex(v.bodyColor);
  const patternIdx = colorIndex(v.patternColor);
  return (
    (shapeIdx & 0xff) |
    ((v.pattern & 0xff) << 8) |
    ((bodyIdx & 0xff) << 16) |
    ((patternIdx & 0xff) << 24)
  );
}

export function decodeVariant(n: number): FishVariant {
  const shape = SHAPES[(n & 0xff) % SHAPES.length] ?? 'flopper';
  const pattern = (n >> 8) & 0xff;
  const body = colorByIndex((n >> 16) & 0xff);
  const pat = colorByIndex((n >> 24) & 0xff);
  return { shape, pattern, bodyColor: body, patternColor: pat };
}

const COLORS: FishColor[] = [
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

function colorIndex(c: FishColor): number {
  return COLORS.indexOf(c);
}
function colorByIndex(i: number): FishColor {
  return COLORS[i % COLORS.length] ?? 'white';
}
