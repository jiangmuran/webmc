import { describe, it, expect } from 'vitest';
import {
  pickTrial,
  firstSafe,
  CHORUS_MAX_DISTANCE,
  CHORUS_HUNGER_RESTORE,
} from './chorus_fruit_teleport';

describe('chorus fruit teleport', () => {
  it('trial within range', () => {
    for (let i = 0; i < 50; i++) {
      const t = pickTrial({ x: 0, y: 0, z: 0 }, Math.random);
      expect(Math.abs(t.x)).toBeLessThanOrEqual(CHORUS_MAX_DISTANCE);
      expect(Math.abs(t.y)).toBeLessThanOrEqual(CHORUS_MAX_DISTANCE);
      expect(Math.abs(t.z)).toBeLessThanOrEqual(CHORUS_MAX_DISTANCE);
    }
  });

  it('first safe picks first safe', () => {
    const r = firstSafe([
      { trialX: 0, trialY: 0, trialZ: 0, safe: false },
      { trialX: 5, trialY: 0, trialZ: 0, safe: true },
      { trialX: 9, trialY: 0, trialZ: 0, safe: true },
    ]);
    expect(r?.trialX).toBe(5);
  });

  it('no safe returns null', () => {
    expect(firstSafe([{ trialX: 0, trialY: 0, trialZ: 0, safe: false }])).toBeNull();
  });

  it('hunger restore 4', () => {
    expect(CHORUS_HUNGER_RESTORE).toBe(4);
  });
});
