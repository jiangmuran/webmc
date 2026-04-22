// Colored beds. 16 dye colors. Dyeing an existing bed consumes 1 dye
// and changes its color without losing the spawn-point binding.

export type BedColor =
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

export const BED_COLORS: readonly BedColor[] = [
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

export function bedBlockId(color: BedColor): string {
  return `webmc:${color}_bed`;
}

export function parseBedId(id: string): BedColor | null {
  const m = /^webmc:(\w+)_bed$/.exec(id);
  if (!m?.[1]) return null;
  const color = m[1];
  return BED_COLORS.includes(color as BedColor) ? (color as BedColor) : null;
}

// Crafting: 3 matching-color wool + 3 matching-color planks = bed.
export interface CraftBedQuery {
  woolColor: BedColor;
  woolCount: number;
  plankCount: number;
}

export function craftBed(q: CraftBedQuery): { item: string; count: 1 } | null {
  if (q.woolCount < 3 || q.plankCount < 3) return null;
  return { item: bedBlockId(q.woolColor), count: 1 };
}

// Dye-on-placed-bed: consumes 1 dye, keeps bed facing + spawn binding.
export interface DyeBedQuery {
  currentColor: BedColor;
  newColor: BedColor;
}

export function dyeBed(q: DyeBedQuery): {
  changed: boolean;
  newBlockId: string;
} {
  if (q.currentColor === q.newColor) {
    return { changed: false, newBlockId: bedBlockId(q.currentColor) };
  }
  return { changed: true, newBlockId: bedBlockId(q.newColor) };
}
