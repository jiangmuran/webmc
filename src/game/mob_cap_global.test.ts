import { describe, it, expect } from 'vitest';
import {
  makeMobState,
  canSpawn,
  onSpawn,
  onDespawn,
  currentCount,
  WORLD_CAPS,
} from './mob_cap_global';

describe('global mob cap', () => {
  it('can spawn initially', () => {
    const s = makeMobState();
    expect(canSpawn(s, 'hostile')).toBe(true);
  });

  it('caps out', () => {
    const s = makeMobState();
    for (let i = 0; i < WORLD_CAPS.hostile; i++) onSpawn(s, 'hostile');
    expect(canSpawn(s, 'hostile')).toBe(false);
  });

  it('despawn frees slot', () => {
    const s = makeMobState();
    for (let i = 0; i < WORLD_CAPS.hostile; i++) onSpawn(s, 'hostile');
    onDespawn(s, 'hostile');
    expect(canSpawn(s, 'hostile')).toBe(true);
  });

  it('despawn does not go below zero', () => {
    const s = makeMobState();
    onDespawn(s, 'passive');
    expect(currentCount(s, 'passive')).toBe(0);
  });

  it('misc uncapped', () => {
    const s = makeMobState();
    for (let i = 0; i < 1_000_000; i++) {
      if (i > 100) break;
      onSpawn(s, 'misc');
    }
    expect(canSpawn(s, 'misc')).toBe(true);
  });
});
