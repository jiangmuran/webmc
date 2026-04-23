import { describe, it, expect } from 'vitest';
import { drawTime, isReady } from './crossbow_quick_charge_tick';

describe('crossbow quick charge tick', () => {
  it('higher level faster draw', () => {
    expect(drawTime(5)).toBeLessThan(drawTime(0));
  });

  it('never below 1', () => {
    expect(drawTime(100)).toBeGreaterThanOrEqual(1);
  });

  it('ready after draw time', () => {
    expect(isReady(drawTime(0), 0)).toBe(true);
    expect(isReady(5, 0)).toBe(false);
  });
});
