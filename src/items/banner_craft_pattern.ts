// Banner pattern application. Up to 6 patterns per banner.
// Some patterns require a special ingredient (creeper head, skull, etc.)

export type BannerPattern =
  | 'stripe_bottom'
  | 'stripe_top'
  | 'stripe_left'
  | 'stripe_right'
  | 'stripe_center'
  | 'stripe_middle'
  | 'square_top_left'
  | 'square_top_right'
  | 'square_bottom_left'
  | 'square_bottom_right'
  | 'triangle_top'
  | 'triangle_bottom'
  | 'cross'
  | 'border'
  | 'curly_border'
  | 'creeper'
  | 'skull'
  | 'flower'
  | 'mojang'
  | 'globe'
  | 'piglin';

export const MAX_BANNER_PATTERNS = 6;

export const SPECIAL_INGREDIENT: Partial<Record<BannerPattern, string>> = {
  creeper: 'creeper_head',
  skull: 'wither_skeleton_skull',
  flower: 'oxeye_daisy',
  mojang: 'enchanted_golden_apple',
  globe: 'globe_banner_pattern',
  piglin: 'piglin_banner_pattern',
};

export function canApplyPattern(
  current: { id: BannerPattern; color: string }[],
  _newPattern: BannerPattern,
): boolean {
  return current.length < MAX_BANNER_PATTERNS;
}

export function requiresSpecial(p: BannerPattern): string | null {
  return SPECIAL_INGREDIENT[p] ?? null;
}
