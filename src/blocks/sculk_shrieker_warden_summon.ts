export interface ShriekerState {
  warningLevel: number;
  canSummon: boolean;
  cooldownTicks: number;
}

// Wiki (minecraft.wiki/w/Sculk_Shrieker): "Naturally generated sculk
// shriekers have a 10-second cooldown per player." 10 s = 200 ticks.
// Old 300 ticks (15 s) was 50% over wiki, throttling warden summons.
//
// Wiki: "Spawning a warden does not decrease the player's warning
// level, so a warden can be immediately summoned again after the
// 10-second cooldown. However, the warning level will not increase
// above 4." Old code reset warningLevel to 0 after a summon, so a
// player who survived one warden had to provoke 4 more shrieks
// before another could spawn — wiki says the level stays at 4.

export const SUMMON_THRESHOLD = 4;
export const COOLDOWN_AFTER_SUMMON = 200;

export function onTriggered(s: ShriekerState): ShriekerState {
  if (s.cooldownTicks > 0) return s;
  const level = Math.min(SUMMON_THRESHOLD, s.warningLevel + 1);
  if (level >= SUMMON_THRESHOLD && s.canSummon) {
    return { ...s, warningLevel: SUMMON_THRESHOLD, cooldownTicks: COOLDOWN_AFTER_SUMMON };
  }
  return { ...s, warningLevel: level };
}

export function shouldSpawnWarden(s: ShriekerState): boolean {
  return s.canSummon && s.warningLevel >= SUMMON_THRESHOLD;
}
