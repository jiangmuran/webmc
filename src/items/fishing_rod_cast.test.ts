import { describe, it, expect } from 'vitest';
import { waitTicks, rollRarity, FISHING_ROD_MAX_DURABILITY } from './fishing_rod_cast';

describe('fishing rod cast', () => {
  it('wait floor 1s', () => {
    expect(
      waitTicks({ lureLevel: 10, luckOfTheSeaLevel: 0, rainingAbove: true, rand: () => 0 }),
    ).toBeGreaterThanOrEqual(20);
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
