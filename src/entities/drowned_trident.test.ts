import { describe, it, expect } from 'vitest';
import { drownedThrowsTrident, drownedTridentDrop, makeDrowned } from './drowned_trident';

describe('drowned trident', () => {
  it('drowned without trident never drops', () => {
    expect(
      drownedTridentDrop({
        drownedHoldsTrident: false,
        lootingLevel: 3,
        rng: () => 0,
      }),
    ).toBe(false);
  });

  it('baseline drop around 8.5%', () => {
    let drops = 0;
    for (let i = 0; i < 10000; i++) {
      if (
        drownedTridentDrop({
          drownedHoldsTrident: true,
          lootingLevel: 0,
          rng: Math.random,
        })
      ) {
        drops++;
      }
    }
    expect(drops).toBeGreaterThan(500);
    expect(drops).toBeLessThan(1500);
  });

  it('looting raises drop rate', () => {
    const r = drownedTridentDrop({
      drownedHoldsTrident: true,
      lootingLevel: 3,
      rng: () => 0.095,
    });
    expect(r).toBe(true);
  });

  it('throws only with target + held trident', () => {
    expect(drownedThrowsTrident(makeDrowned(false), true)).toBe(false);
    expect(drownedThrowsTrident(makeDrowned(true), false)).toBe(false);
    expect(drownedThrowsTrident(makeDrowned(true), true)).toBe(true);
  });
});
