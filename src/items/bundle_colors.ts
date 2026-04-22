// Dyed bundle variants (1.21.2+). Crafting a white bundle with any dye
// produces that colored bundle; contents are preserved. Bundle color is
// purely cosmetic.

export type BundleDyeColor =
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

export const BUNDLE_COLORS: readonly BundleDyeColor[] = [
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

export function bundleItemId(color: BundleDyeColor): string {
  if (color === 'white') return 'webmc:bundle';
  return `webmc:${color}_bundle`;
}

export function parseBundleId(itemId: string): BundleDyeColor | null {
  if (itemId === 'webmc:bundle') return 'white';
  const m = /^webmc:(\w+)_bundle$/.exec(itemId);
  if (!m?.[1]) return null;
  const color = m[1];
  return BUNDLE_COLORS.includes(color as BundleDyeColor) ? (color as BundleDyeColor) : null;
}

// Craft: bundle + dye = colored bundle (preserves contents).
export interface DyeCraftQuery {
  bundleColor: BundleDyeColor;
  dye: BundleDyeColor;
}

export function craftDyedBundle(
  q: DyeCraftQuery,
): { itemId: string; color: BundleDyeColor } | null {
  if (q.bundleColor === q.dye) return null;
  return { itemId: bundleItemId(q.dye), color: q.dye };
}

// Check if an item id is any bundle variant (for inventory grouping).
export function isAnyBundle(itemId: string): boolean {
  return parseBundleId(itemId) !== null;
}

// Recursion: bundles of bundles aren't allowed.
export function canStore(itemId: string): boolean {
  return !isAnyBundle(itemId);
}
