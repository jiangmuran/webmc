import { xpForLevel } from './xp_segments_helper';

export interface XPBar {
  level: number;
  progressInLevel: number;
}

export function fractionInLevel(b: XPBar): number {
  const total = xpForLevel(b.level);
  return total <= 0 ? 0 : Math.max(0, Math.min(1, b.progressInLevel / total));
}

export function addXp(b: XPBar, xp: number): XPBar {
  let level = b.level;
  let progress = b.progressInLevel + xp;
  while (progress >= xpForLevel(level)) {
    progress -= xpForLevel(level);
    level++;
  }
  return { level, progressInLevel: progress };
}
