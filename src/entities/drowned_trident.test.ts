import { describe, it, expect } from 'vitest';
import {
  drownedThrowsTrident,
  drownedTridentDrop,
  makeDrowned,
  TRIDENT_DROP_CAP,
} from './drowned_trident';

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

  it('drop chance caps at 11.5% per wiki (Looting III)', () => {
    // Wiki (minecraft.wiki/w/Drowned#Drops): cap is 11.5% at Looting
    // III. Looting V or higher must not exceed the cap.
    expect(TRIDENT_DROP_CAP).toBeCloseTo(0.115);
    // Roll just above the cap → no drop even at Looting V.
    expect(
      drownedTridentDrop({
        drownedHoldsTrident: true,
        lootingLevel: 5,
        rng: () => 0.116,
      }),
    ).toBe(false);
    // Roll just below the cap → drops.
    expect(
      drownedTridentDrop({
        drownedHoldsTrident: true,
        lootingLevel: 5,
        rng: () => 0.114,
      }),
    ).toBe(true);
  });
});
