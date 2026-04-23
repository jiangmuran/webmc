// Loom: apply a banner pattern using dye and optional banner pattern
// item. Output preserves existing patterns + 1 new.

export const LOOM_PATTERN_CAP = 6;

export interface LoomInput {
  bannerPatterns: number;
  dye: string | null;
  patternItem: string | null;
}

export function canApply(i: LoomInput): boolean {
  if (i.bannerPatterns >= LOOM_PATTERN_CAP) return false;
  return i.dye !== null;
}

export function consumesPatternItem(patternItem: string | null): boolean {
  if (!patternItem) return false;
  return !patternItem.startsWith('banner_pattern_'); // Banner-pattern items are NOT consumed (1.17+).
}

export function outputPatternCount(existing: number): number {
  return Math.min(LOOM_PATTERN_CAP, existing + 1);
}
