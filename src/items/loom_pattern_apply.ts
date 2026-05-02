// Loom. Applies a single banner pattern to a banner, consuming 1 dye
// and (for special patterns) a pattern item. Max 6 layers per banner.
//
// Wiki (minecraft.wiki/w/Banner_Pattern): the special-template
// patterns are creeper, skull, flower, mojang/'thing', globe, piglin,
// plus 1.21 trial-chamber additions flow + guster. Old union and
// PATTERN_ITEM_REQUIRED set both lacked flow + guster — 1.21 players
// couldn't apply those patterns at the loom even when holding the
// matching banner_pattern item. Sibling banner_craft_pattern.ts and
// banner_pattern_layer_apply.ts already include them.

export type BannerPatternCode =
  | 'base'
  | 'stripe_top'
  | 'stripe_bottom'
  | 'stripe_left'
  | 'stripe_right'
  | 'stripe_center'
  | 'stripe_middle'
  | 'stripe_downright'
  | 'stripe_downleft'
  | 'small_stripes'
  | 'cross'
  | 'square_bottom_left'
  | 'square_bottom_right'
  | 'square_top_left'
  | 'square_top_right'
  | 'border'
  | 'curly_border'
  | 'creeper'
  | 'gradient'
  | 'gradient_up'
  | 'bricks'
  | 'skull'
  | 'flower'
  | 'mojang'
  | 'globe'
  | 'piglin'
  | 'flow'
  | 'guster';

export const PATTERN_ITEM_REQUIRED = new Set<BannerPatternCode>([
  'creeper',
  'skull',
  'flower',
  'mojang',
  'globe',
  'piglin',
  'flow',
  'guster',
]);

export const MAX_LAYERS = 6;

export interface BannerLayer {
  pattern: BannerPatternCode;
  color: string;
}

export interface Banner {
  base: string;
  layers: BannerLayer[];
}

export interface ApplyQuery {
  banner: Banner;
  pattern: BannerPatternCode;
  dye: string;
  patternItemPresent: boolean;
}

export type ApplyResult = 'ok' | 'full' | 'missing_pattern_item';

export function applyPattern(q: ApplyQuery): ApplyResult {
  if (q.banner.layers.length >= MAX_LAYERS) return 'full';
  if (PATTERN_ITEM_REQUIRED.has(q.pattern) && !q.patternItemPresent) {
    return 'missing_pattern_item';
  }
  q.banner.layers.push({ pattern: q.pattern, color: q.dye });
  return 'ok';
}

export function undoLastLayer(b: Banner): BannerLayer | null {
  return b.layers.pop() ?? null;
}
