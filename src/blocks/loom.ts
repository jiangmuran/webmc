// Loom — applies a banner pattern (uses a banner pattern item + dye) to
// an existing banner. Unlike crafting-table banner patterning, the loom
// consumes one dye + one pattern-item (when required) and outputs a
// banner with the new layer applied.

import type { BannerColor, BannerPatternId, BannerState } from './banner';
import { addLayer } from './banner';

// A handful of loom patterns don't need a pattern item (stripes, squares,
// border, cross, triangle etc.); "special" ones require the matching
// banner pattern item.
const SPECIAL_PATTERNS = new Set<BannerPatternId>([
  'creeper',
  'skull',
  'flower',
  'mojang',
  'globe',
  'piglin',
]);

export function patternRequiresItem(pattern: BannerPatternId): boolean {
  return SPECIAL_PATTERNS.has(pattern);
}

export interface LoomQuery {
  banner: BannerState;
  dye: BannerColor;
  pattern: BannerPatternId;
  patternItemPresent: boolean;
}

export interface LoomResult {
  accepted: boolean;
  reason?: string;
}

export function applyLoomPattern(q: LoomQuery): LoomResult {
  if (q.banner.layers.length >= 6) {
    return { accepted: false, reason: 'max_layers' };
  }
  if (patternRequiresItem(q.pattern) && !q.patternItemPresent) {
    return { accepted: false, reason: 'missing_pattern_item' };
  }
  if (!addLayer(q.banner, { pattern: q.pattern, color: q.dye })) {
    return { accepted: false, reason: 'add_failed' };
  }
  return { accepted: true };
}
