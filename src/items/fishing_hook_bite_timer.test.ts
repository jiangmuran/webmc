import { describe, it, expect } from 'vitest';
import { initialWait, isBiting, MIN_WAIT_TICKS } from './fishing_hook_bite_timer';

describe('fishing hook bite timer', () => {
  it('wait within range', () => {
    const w = initialWait(0, () => 0.5);
    expect(w).toBeGreaterThanOrEqual(MIN_WAIT_TICKS);
  });

  it('lure reduces wait', () => {
    const plain = initialWait(0, () => 0.9);
    const lure = initialWait(3, () => 0.9);
    expect(lure).toBeLessThan(plain);
  });

  it('biting after wait reached', () => {
    expect(
      isBiting({
        ticksInWater: 200,
        waitTicks: 100,
        lureLevel: 0,
        luckLevel: 0,
        openSkyAbove: true,
        rng: () => 0.5,
      }),
    ).toBe(true);
  });

  it('not biting early', () => {
    expect(
      isBiting({
        ticksInWater: 50,
        waitTicks: 200,
        lureLevel: 0,
        luckLevel: 0,
        openSkyAbove: true,
        rng: () => 0.5,
      }),
    ).toBe(false);
  });

  it('no sky no bite', () => {
    expect(
      isBiting({
        ticksInWater: 500,
        waitTicks: 100,
        lureLevel: 0,
        luckLevel: 0,
        openSkyAbove: false,
        rng: () => 0.5,
      }),
    ).toBe(false);
  });
});
