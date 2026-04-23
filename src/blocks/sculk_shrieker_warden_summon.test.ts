import { describe, it, expect } from 'vitest';
import { onTriggered, shouldSpawnWarden, SUMMON_THRESHOLD } from './sculk_shrieker_warden_summon';

describe('sculk shrieker warden summon', () => {
  it('increments warning', () => {
    const s = onTriggered({ warningLevel: 0, canSummon: true, cooldownTicks: 0 });
    expect(s.warningLevel).toBe(1);
  });

  it('summons at threshold', () => {
    let s = { warningLevel: SUMMON_THRESHOLD - 1, canSummon: true, cooldownTicks: 0 };
    s = onTriggered(s);
    expect(s.cooldownTicks).toBeGreaterThan(0);
  });

  it('cooldown blocks retrigger', () => {
    const s = onTriggered({ warningLevel: 0, canSummon: true, cooldownTicks: 50 });
    expect(s.warningLevel).toBe(0);
  });

  it('no summon without canSummon', () => {
    expect(shouldSpawnWarden({ warningLevel: 10, canSummon: false, cooldownTicks: 0 })).toBe(false);
  });
});
