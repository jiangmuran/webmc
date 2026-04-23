import { describe, it, expect } from 'vitest';
import { init, tick, settleToRest, MAX_BEND } from './cape_flap_sim';

describe('cape flap sim', () => {
  it('init bend zero', () => {
    expect(init(0, 0).bendRadians).toBe(0);
  });

  it('movement bends cape', () => {
    let s = init(0, 0);
    s = tick(s, 5, 0, 1000);
    expect(s.bendRadians).toBeGreaterThan(0);
  });

  it('stationary → rests toward zero', () => {
    let s = { bendRadians: 1, lastX: 0, lastZ: 0 };
    for (let i = 0; i < 100; i++) s = settleToRest(s);
    expect(s.bendRadians).toBeCloseTo(0);
  });

  it('bend caps at MAX', () => {
    let s = init(0, 0);
    for (let i = 0; i < 20; i++) s = tick(s, 1000 * (i + 1), 0, 16);
    expect(s.bendRadians).toBeLessThanOrEqual(MAX_BEND);
  });
});
