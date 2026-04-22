import { describe, it, expect } from 'vitest';
import { currentWavePlan, makeRaid, tickRaid, totalWaves } from './raid';

describe('raid', () => {
  it('starts active on wave 1', () => {
    const r = makeRaid(1);
    expect(r.status).toBe('active');
    expect(r.currentWave).toBe(1);
  });

  it('bad omen level 1 → 3 waves, level 3 → 5 waves', () => {
    expect(totalWaves(makeRaid(1))).toBe(3);
    expect(totalWaves(makeRaid(3))).toBe(5);
  });

  it('village destruction ends the raid as lost', () => {
    const r = makeRaid(1);
    r.villageHealth = 0;
    const result = tickRaid(r);
    expect(result.ended).toBe('lost');
    expect(r.status).toBe('lost');
  });

  it('clearing all waves ends as won', () => {
    const r = makeRaid(3);
    const waves = totalWaves(r);
    for (let w = 0; w < waves; w++) {
      const plan = currentWavePlan(r);
      if (!plan) break;
      r.spawnedCount = plan.spawns.reduce((s, g) => s + g.count, 0);
      r.liveCount = 0;
      tickRaid(r); // advance to next wave
    }
    expect(r.status).toBe('won');
  });

  it('wave 1 has both pillagers and a vindicator', () => {
    const plan = currentWavePlan(makeRaid(1));
    expect(plan).not.toBeNull();
    expect(plan?.spawns.some((s) => s.kind === 'pillager')).toBe(true);
    expect(plan?.spawns.some((s) => s.kind === 'vindicator')).toBe(true);
  });

  it('wave 5 adds evokers', () => {
    const r = makeRaid(5);
    r.currentWave = 5;
    const plan = currentWavePlan(r);
    expect(plan?.spawns.some((s) => s.kind === 'evoker')).toBe(true);
  });
});
