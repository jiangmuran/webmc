// Banner pattern registry. Each pattern has an id, a single-char loom
// code, and optional ingredient requirements (some patterns need a
// specific pattern item). Stacking up to 6 patterns on one banner.

export type BannerPatternId =
  | 'base'
  | 'stripe_bottom'
  | 'stripe_top'
  | 'stripe_left'
  | 'stripe_right'
  | 'stripe_center'
  | 'stripe_middle'
  | 'stripe_downright'
  | 'stripe_downleft'
  | 'small_stripes'
  | 'cross'
  | 'straight_cross'
  | 'diagonal_left'
  | 'diagonal_right'
  | 'diagonal_up_left'
  | 'diagonal_up_right'
  | 'half_horizontal'
  | 'half_horizontal_bottom'
  | 'half_vertical'
  | 'half_vertical_right'
  | 'square_top_left'
  | 'square_top_right'
  | 'square_bottom_left'
  | 'square_bottom_right'
  | 'triangle_top'
  | 'triangle_bottom'
  | 'triangles_top'
  | 'triangles_bottom'
  | 'circle'
  | 'rhombus'
  | 'border'
  | 'curly_border'
  | 'bricks'
  | 'gradient'
  | 'gradient_up'
  | 'creeper'
  | 'skull'
  | 'flower'
  | 'mojang'
  | 'globe'
  | 'piglin'
  | 'flow'
  | 'guster';

export interface BannerPatternDef {
  id: BannerPatternId;
  loomCode: string;
  needsPatternItem: string | null;
}

const PATTERNS: readonly BannerPatternDef[] = [
  { id: 'base', loomCode: 'b', needsPatternItem: null },
  { id: 'stripe_bottom', loomCode: 'bs', needsPatternItem: null },
  { id: 'stripe_top', loomCode: 'ts', needsPatternItem: null },
  { id: 'stripe_left', loomCode: 'ls', needsPatternItem: null },
  { id: 'stripe_right', loomCode: 'rs', needsPatternItem: null },
  { id: 'stripe_center', loomCode: 'cs', needsPatternItem: null },
  { id: 'stripe_middle', loomCode: 'ms', needsPatternItem: null },
  { id: 'stripe_downright', loomCode: 'dls', needsPatternItem: null },
  { id: 'stripe_downleft', loomCode: 'drs', needsPatternItem: null },
  { id: 'small_stripes', loomCode: 'ss', needsPatternItem: null },
  { id: 'cross', loomCode: 'cr', needsPatternItem: null },
  { id: 'straight_cross', loomCode: 'sc', needsPatternItem: null },
  { id: 'diagonal_left', loomCode: 'ld', needsPatternItem: null },
  { id: 'diagonal_right', loomCode: 'rd', needsPatternItem: null },
  { id: 'diagonal_up_left', loomCode: 'lud', needsPatternItem: null },
  { id: 'diagonal_up_right', loomCode: 'rud', needsPatternItem: null },
  { id: 'half_horizontal', loomCode: 'hh', needsPatternItem: null },
  { id: 'half_horizontal_bottom', loomCode: 'hhb', needsPatternItem: null },
  { id: 'half_vertical', loomCode: 'vh', needsPatternItem: null },
  { id: 'half_vertical_right', loomCode: 'vhr', needsPatternItem: null },
  { id: 'square_top_left', loomCode: 'tl', needsPatternItem: null },
  { id: 'square_top_right', loomCode: 'tr', needsPatternItem: null },
  { id: 'square_bottom_left', loomCode: 'bl', needsPatternItem: null },
  { id: 'square_bottom_right', loomCode: 'br', needsPatternItem: null },
  { id: 'triangle_top', loomCode: 'tt', needsPatternItem: null },
  { id: 'triangle_bottom', loomCode: 'bt', needsPatternItem: null },
  { id: 'triangles_top', loomCode: 'tts', needsPatternItem: null },
  { id: 'triangles_bottom', loomCode: 'bts', needsPatternItem: null },
  { id: 'circle', loomCode: 'mc', needsPatternItem: null },
  { id: 'rhombus', loomCode: 'mr', needsPatternItem: null },
  { id: 'border', loomCode: 'bo', needsPatternItem: null },
  { id: 'curly_border', loomCode: 'cbo', needsPatternItem: 'webmc:vines' },
  { id: 'bricks', loomCode: 'bri', needsPatternItem: 'webmc:bricks' },
  { id: 'gradient', loomCode: 'gra', needsPatternItem: null },
  { id: 'gradient_up', loomCode: 'gru', needsPatternItem: null },
  { id: 'creeper', loomCode: 'cre', needsPatternItem: 'webmc:creeper_head' },
  { id: 'skull', loomCode: 'sku', needsPatternItem: 'webmc:wither_skeleton_skull' },
  { id: 'flower', loomCode: 'flo', needsPatternItem: 'webmc:oxeye_daisy' },
  { id: 'mojang', loomCode: 'moj', needsPatternItem: 'webmc:enchanted_golden_apple' },
  { id: 'globe', loomCode: 'glb', needsPatternItem: 'webmc:globe_banner_pattern' },
  { id: 'piglin', loomCode: 'pig', needsPatternItem: 'webmc:piglin_banner_pattern' },
  { id: 'flow', loomCode: 'flow', needsPatternItem: 'webmc:flow_banner_pattern' },
  { id: 'guster', loomCode: 'gust', needsPatternItem: 'webmc:guster_banner_pattern' },
];

export function patternById(id: BannerPatternId): BannerPatternDef | null {
  return PATTERNS.find((p) => p.id === id) ?? null;
}

// Wiki (minecraft.wiki/w/Banner): "A banner can have up to 6 patterns
// applied to it." Old 16 was the same bug already fixed in three
// blocks-side siblings (banner.ts, banner_pattern.ts,
// banner_pattern_layering.ts) and items/banner_craft_pattern.ts —
// this items-side copy was the holdout, allowing players to stack 16
// loom layers when the canonical loom UI tops out at 6.
export const MAX_PATTERNS_PER_BANNER = 6;

export interface BannerStack {
  baseColor: string;
  layers: { id: BannerPatternId; color: string }[];
}

export function addLayer(stack: BannerStack, id: BannerPatternId, color: string): boolean {
  if (stack.layers.length >= MAX_PATTERNS_PER_BANNER) return false;
  stack.layers.push({ id, color });
  return true;
}

// Crafting in a loom: dye + banner + optional pattern item = applied layer.
export interface LoomQuery {
  banner: BannerStack;
  dye: string;
  pattern: BannerPatternId;
  providedPatternItem: string | null;
}

export function loomApply(q: LoomQuery): boolean {
  const def = patternById(q.pattern);
  if (!def) return false;
  if (def.needsPatternItem && q.providedPatternItem !== def.needsPatternItem) return false;
  return addLayer(q.banner, q.pattern, q.dye);
}
