// Banner patterns. A banner stacks up to 6 pattern layers, each defined
// by a pattern id + dye color. Purely cosmetic; renderer composites the
// layers in order.

export type BannerColor =
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

export type BannerPatternId =
  | 'base'
  | 'stripe_bottom'
  | 'stripe_top'
  | 'stripe_left'
  | 'stripe_right'
  | 'stripe_center'
  | 'stripe_middle'
  | 'square_bottom_left'
  | 'square_bottom_right'
  | 'square_top_left'
  | 'square_top_right'
  | 'triangle_bottom'
  | 'triangle_top'
  | 'triangles_bottom'
  | 'triangles_top'
  | 'cross'
  | 'border'
  | 'curly_border'
  | 'creeper'
  | 'skull'
  | 'flower'
  | 'mojang'
  | 'globe'
  | 'piglin';

export interface BannerLayer {
  pattern: BannerPatternId;
  color: BannerColor;
}

export interface BannerState {
  baseColor: BannerColor;
  layers: BannerLayer[];
}

const MAX_LAYERS = 6;

export function makeBanner(baseColor: BannerColor = 'white'): BannerState {
  return { baseColor, layers: [] };
}

export function addLayer(banner: BannerState, layer: BannerLayer): boolean {
  if (banner.layers.length >= MAX_LAYERS) return false;
  banner.layers.push(layer);
  return true;
}

export function clearLayers(banner: BannerState): void {
  banner.layers.length = 0;
}

export function layerCount(banner: BannerState): number {
  return banner.layers.length;
}

// Cauldron washes off one layer at a time. Returns true if any layer was
// removed.
export function washOneLayer(banner: BannerState): boolean {
  if (banner.layers.length === 0) return false;
  banner.layers.pop();
  return true;
}
