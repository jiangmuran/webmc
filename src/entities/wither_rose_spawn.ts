// Wither rose. Plants where a mob died to the wither boss. Stepping
// on it applies Wither II. Cannot be grown with bone meal.

export interface RoseEffectQuery {
  standingOn: 'webmc:wither_rose' | 'other';
  inCreative: boolean;
}

export const WITHER_LEVEL = 1; // zero-indexed = wither II
export const WITHER_DURATION_TICKS = 40;

export interface RoseEffectResult {
  applied: boolean;
  amplifier: number;
  durationTicks: number;
}

export function onStepOn(q: RoseEffectQuery): RoseEffectResult {
  if (q.standingOn !== 'webmc:wither_rose') {
    return { applied: false, amplifier: 0, durationTicks: 0 };
  }
  if (q.inCreative) return { applied: false, amplifier: 0, durationTicks: 0 };
  return { applied: true, amplifier: WITHER_LEVEL, durationTicks: WITHER_DURATION_TICKS };
}

// Spawn at death location if killed by wither (not wither skull).
export interface DeathSpawnQuery {
  killedByWitherBoss: boolean;
  surfaceBlockReplaceable: boolean;
}

export function shouldSpawnRose(q: DeathSpawnQuery): boolean {
  return q.killedByWitherBoss && q.surfaceBlockReplaceable;
}
