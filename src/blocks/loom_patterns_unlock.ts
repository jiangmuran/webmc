// Loom pattern unlock order: some patterns require finding a template
// (dropped from raid vindicator or wandering trader), which is added
// to the player's known-patterns list.

export type PatternCode =
  | 'creeper'
  | 'skull'
  | 'flower'
  | 'mojang'
  | 'globe'
  | 'piglin'
  | 'base'
  | 'stripe'
  | 'bricks'
  | 'border';

export interface KnownPatterns {
  unlocked: Set<PatternCode>;
}

export const DEFAULT_UNLOCKED: PatternCode[] = ['base', 'stripe', 'bricks', 'border'];

export function makeKnown(): KnownPatterns {
  return { unlocked: new Set(DEFAULT_UNLOCKED) };
}

export function learn(k: KnownPatterns, p: PatternCode): boolean {
  if (k.unlocked.has(p)) return false;
  k.unlocked.add(p);
  return true;
}

export function canUseInLoom(k: KnownPatterns, p: PatternCode): boolean {
  return k.unlocked.has(p);
}

// Pattern source drop table.
const SOURCES: Record<PatternCode, string | null> = {
  creeper: 'creeper_head',
  skull: 'wither_skeleton_skull',
  flower: 'oxeye_daisy',
  mojang: 'enchanted_golden_apple',
  globe: 'banner_pattern_globe',
  piglin: 'banner_pattern_piglin',
  base: null,
  stripe: null,
  bricks: null,
  border: null,
};

export function requiredSource(p: PatternCode): string | null {
  return SOURCES[p];
}
