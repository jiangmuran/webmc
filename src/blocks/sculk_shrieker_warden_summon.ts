export interface ShriekerState {
  warningLevel: number;
  canSummon: boolean;
  cooldownTicks: number;
}

export const SUMMON_THRESHOLD = 4;
export const COOLDOWN_AFTER_SUMMON = 300;

export function onTriggered(s: ShriekerState): ShriekerState {
  if (s.cooldownTicks > 0) return s;
  const level = s.warningLevel + 1;
  if (level >= SUMMON_THRESHOLD && s.canSummon) {
    return { ...s, warningLevel: 0, cooldownTicks: COOLDOWN_AFTER_SUMMON };
  }
  return { ...s, warningLevel: level };
}

export function shouldSpawnWarden(s: ShriekerState): boolean {
  return s.canSummon && s.warningLevel >= SUMMON_THRESHOLD;
}
