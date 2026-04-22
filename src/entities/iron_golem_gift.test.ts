import { describe, it, expect } from 'vitest';
import { interrupt, makeGiftState, tickGift } from './iron_golem_gift';

describe('iron golem gift', () => {
  it('starts without poppy', () => {
    const s = makeGiftState();
    expect(s.holdingPoppy).toBe(false);
  });

  it('obtains poppy on low roll', () => {
    const s = makeGiftState();
    tickGift(s, {
      golemPos: { x: 0, y: 64, z: 0 },
      nearestVillager: null,
      villagerOccupied: false,
      rng: () => 0.001,
    });
    expect(s.holdingPoppy).toBe(true);
  });

  it('presents to nearby villager', () => {
    const s = makeGiftState();
    s.holdingPoppy = true;
    const r = tickGift(s, {
      golemPos: { x: 0, y: 64, z: 0 },
      nearestVillager: { id: 5, pos: { x: 2, y: 64, z: 0 } },
      villagerOccupied: false,
      rng: () => 0.5,
    });
    expect(r.startedPresenting).toBe(true);
  });

  it('occupied villager = no present', () => {
    const s = makeGiftState();
    s.holdingPoppy = true;
    const r = tickGift(s, {
      golemPos: { x: 0, y: 64, z: 0 },
      nearestVillager: { id: 5, pos: { x: 2, y: 64, z: 0 } },
      villagerOccupied: true,
      rng: () => 0.5,
    });
    expect(r.startedPresenting).toBe(false);
  });

  it('present completes after duration', () => {
    const s = makeGiftState();
    s.holdingPoppy = true;
    s.presentingToId = 5;
    for (let i = 0; i < 40; i++) {
      tickGift(s, {
        golemPos: { x: 0, y: 64, z: 0 },
        nearestVillager: { id: 5, pos: { x: 2, y: 64, z: 0 } },
        villagerOccupied: false,
        rng: () => 0.5,
      });
    }
    expect(s.holdingPoppy).toBe(false);
  });

  it('interrupt clears poppy', () => {
    const s = makeGiftState();
    s.holdingPoppy = true;
    expect(interrupt(s)).toBe(true);
    expect(s.holdingPoppy).toBe(false);
  });
});
