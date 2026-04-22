import { describe, it, expect } from 'vitest';
import {
  makeIronGolem,
  tryGrabFlower,
  tryGiveFlower,
  ironRepair,
  MAX_HP,
} from './iron_golem_villager_gift';

describe('iron golem gift', () => {
  it('grabs flower on low roll', () => {
    const g = makeIronGolem();
    expect(
      tryGrabFlower(g, {
        nowTick: 1000,
        villagerAdultPresent: true,
        childNearby: false,
        rand: () => 0,
      }),
    ).toBe(true);
    expect(g.holdingFlower).toBe(true);
  });

  it('already holding blocks', () => {
    const g = { hp: MAX_HP, holdingFlower: true, lastGiftGivenTick: 0 };
    expect(
      tryGrabFlower(g, {
        nowTick: 1000,
        villagerAdultPresent: true,
        childNearby: false,
        rand: () => 0,
      }),
    ).toBe(false);
  });

  it('give requires child', () => {
    const g = { hp: MAX_HP, holdingFlower: true, lastGiftGivenTick: 0 };
    expect(tryGiveFlower(g, { childNearby: false, nowTick: 1000 })).toBe(false);
    expect(tryGiveFlower(g, { childNearby: true, nowTick: 1000 })).toBe(true);
  });

  it('iron repair', () => {
    const g = { hp: 10, holdingFlower: false, lastGiftGivenTick: 0 };
    expect(ironRepair(g)).toBe(true);
    expect(g.hp).toBe(35);
  });

  it('full hp no repair', () => {
    const g = { hp: MAX_HP, holdingFlower: false, lastGiftGivenTick: 0 };
    expect(ironRepair(g)).toBe(false);
  });
});
