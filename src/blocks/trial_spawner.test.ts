import { describe, it, expect } from 'vitest';
import {
  makeTrialSpawner,
  shouldSpawn,
  onWaveDefeated,
  ejectReward,
  activeMobCap,
} from './trial_spawner';

describe('trial spawner', () => {
  it('cap scales with players', () => {
    expect(activeMobCap(makeTrialSpawner(1))).toBe(2);
    expect(activeMobCap(makeTrialSpawner(3))).toBe(6);
  });

  it('cap floor 1', () => {
    expect(activeMobCap(makeTrialSpawner(0))).toBe(1);
  });

  it('spawns while under cap', () => {
    expect(shouldSpawn(makeTrialSpawner(1))).toBe(true);
  });

  it('stops at cap', () => {
    const s = { ...makeTrialSpawner(1), activeMobs: 2 };
    expect(shouldSpawn(s)).toBe(false);
  });

  it('wave defeated resets active', () => {
    const s = { ...makeTrialSpawner(1), activeMobs: 2 };
    const after = onWaveDefeated(s);
    expect(after.wavesRemaining).toBe(2);
    expect(after.activeMobs).toBe(0);
  });

  it('no reward until waves done', () => {
    expect(ejectReward(makeTrialSpawner(1)).rewardDropped).toBe(false);
  });

  it('reward after all waves', () => {
    let s = makeTrialSpawner(1);
    for (let i = 0; i < 3; i++) s = onWaveDefeated(s);
    expect(ejectReward(s).rewardDropped).toBe(true);
  });
});
