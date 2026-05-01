import { describe, it, expect } from 'vitest';
import { waitTicks, rollRarity, FISHING_ROD_MAX_DURABILITY } from './fishing_rod_cast';

describe('fishing rod cast', () => {
  it('wait floor at 0 (wiki: Lure III can drop wait below 1s)', () => {
    // Wiki (minecraft.wiki/w/Fishing): "Each level of Lure subtracts
    // 5 seconds (100 ticks) from the wait." With Lure III (-300
    // ticks) the wait can drop to 0; sibling
    // fishing_hook_bite_timer.ts floors at 0 too.
    expect(
      waitTicks({ lureLevel: 10, luckOfTheSeaLevel: 0, rainingAbove: true, rand: () => 0 }),
    ).toBe(0);
  });

  it('lure III on average roll still positive', () => {
    // Sanity: realistic Lure III + average roll should leave some
    // wait (not stuck at 0 always).
    expect(
      waitTicks({ lureLevel: 3, luckOfTheSeaLevel: 0, rainingAbove: false, rand: () => 0.5 }),
    ).toBeGreaterThan(0);
  });

  it('lure reduces wait', () => {
    const a = waitTicks({
      lureLevel: 0,
      luckOfTheSeaLevel: 0,
      rainingAbove: false,
      rand: () => 0.5,
    });
    const b = waitTicks({
      lureLevel: 3,
      luckOfTheSeaLevel: 0,
      rainingAbove: false,
      rand: () => 0.5,
    });
    expect(b).toBeLessThan(a);
  });

  it('rollRarity at low roll → treasure', () => {
    expect(
      rollRarity({ lureLevel: 0, luckOfTheSeaLevel: 3, rainingAbove: false, rand: () => 0 }),
    ).toBe('treasure');
  });

  it('rollRarity at high roll → fish', () => {
    expect(
      rollRarity({ lureLevel: 0, luckOfTheSeaLevel: 0, rainingAbove: false, rand: () => 0.95 }),
    ).toBe('fish');
  });

  it('max durability', () => {
    expect(FISHING_ROD_MAX_DURABILITY).toBe(64);
  });
});
