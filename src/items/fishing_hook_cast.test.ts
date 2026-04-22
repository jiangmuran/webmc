import { describe, it, expect } from 'vitest';
import { castHook, enterWater, exitWater, tickHook, reel } from './fishing_hook_cast';

describe('fishing hook', () => {
  it('lure reduces wait', () => {
    const a = castHook(0, 0, () => 1);
    const b = castHook(3, 0, () => 1);
    expect(b.catchTicksRemaining).toBeLessThan(a.catchTicksRemaining);
  });

  it('tick while in water drops counter', () => {
    const h = castHook(0, 0, () => 0);
    enterWater(h);
    const before = h.catchTicksRemaining;
    tickHook(h);
    expect(h.catchTicksRemaining).toBe(before - 1);
  });

  it('bite ready fires', () => {
    const h = { inWater: true, catchTicksRemaining: 1, lureLevel: 0, luckLevel: 0 };
    expect(tickHook(h).biteReady).toBe(true);
  });

  it('reel when bite ready catches', () => {
    const h = { inWater: true, catchTicksRemaining: 0, lureLevel: 0, luckLevel: 0 };
    expect(reel(h)).toBe('caught');
  });

  it('reel out-of-water recasts', () => {
    const h = castHook(0, 0, () => 0);
    expect(reel(h)).toBe('recast');
  });

  it('exit water stops ticking', () => {
    const h = castHook(0, 0, () => 0);
    enterWater(h);
    exitWater(h);
    const before = h.catchTicksRemaining;
    tickHook(h);
    expect(h.catchTicksRemaining).toBe(before);
  });
});
