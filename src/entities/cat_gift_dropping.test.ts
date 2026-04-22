import { describe, it, expect } from 'vitest';
import { tryMorningGift, GIFT_CHANCE, PURR_REGEN_TICKS } from './cat_gift_dropping';

describe('cat gift', () => {
  it('no sleep = no gift', () => {
    expect(tryMorningGift({ ownerSlept: false, catSleepingNear: true, rand: () => 0 })).toBeNull();
  });

  it('no cat near = no gift', () => {
    expect(tryMorningGift({ ownerSlept: true, catSleepingNear: false, rand: () => 0 })).toBeNull();
  });

  it('low roll = gift', () => {
    expect(
      tryMorningGift({ ownerSlept: true, catSleepingNear: true, rand: () => 0 }),
    ).not.toBeNull();
  });

  it('high roll = no gift', () => {
    expect(
      tryMorningGift({
        ownerSlept: true,
        catSleepingNear: true,
        rand: () => GIFT_CHANCE + 0.01,
      }),
    ).toBeNull();
  });

  it('purr regen time set', () => {
    expect(PURR_REGEN_TICKS).toBe(100);
  });
});
