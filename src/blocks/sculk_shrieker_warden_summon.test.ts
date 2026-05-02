import { describe, it, expect } from 'vitest';
import { onTriggered, shouldSpawnWarden, SUMMON_THRESHOLD } from './sculk_shrieker_warden_summon';

describe('sculk shrieker warden summon', () => {
  it('increments warning', () => {
    const s = onTriggered({ warningLevel: 0, canSummon: true, cooldownTicks: 0 });
    expect(s.warningLevel).toBe(1);
  });

  it('summons at threshold; warning level stays at 4 (wiki)', () => {
    let s = { warningLevel: SUMMON_THRESHOLD - 1, canSummon: true, cooldownTicks: 0 };
    s = onTriggered(s);
    expect(s.cooldownTicks).toBeGreaterThan(0);
    // Wiki: "Spawning a warden does not decrease the player's
    // warning level" — old code reset to 0.
    expect(s.warningLevel).toBe(SUMMON_THRESHOLD);
  });

  it('cooldown is 10 seconds = 200 ticks (wiki)', () => {
    const s = onTriggered({
      warningLevel: SUMMON_THRESHOLD - 1,
      canSummon: true,
      cooldownTicks: 0,
    });
    expect(s.cooldownTicks).toBe(200);
  });

  it('warning level capped at 4 (wiki: not above 4)', () => {
    const s = onTriggered({
      warningLevel: SUMMON_THRESHOLD,
      canSummon: false, // can't summon, just shrieks
      cooldownTicks: 0,
    });
    expect(s.warningLevel).toBe(SUMMON_THRESHOLD);
  });

  it('cooldown blocks retrigger', () => {
    const s = onTriggered({ warningLevel: 0, canSummon: true, cooldownTicks: 50 });
    expect(s.warningLevel).toBe(0);
  });

  it('no summon without canSummon', () => {
    expect(shouldSpawnWarden({ warningLevel: 10, canSummon: false, cooldownTicks: 0 })).toBe(false);
  });
});
