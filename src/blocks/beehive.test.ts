import { describe, it, expect } from 'vitest';
import { addPollination, enterHive, harvest, leaveHive, makeBeehive } from './beehive';

describe('beehive', () => {
  it('holds up to 3 bees', () => {
    const h = makeBeehive();
    expect(enterHive(h, 1)).toBe(true);
    expect(enterHive(h, 2)).toBe(true);
    expect(enterHive(h, 3)).toBe(true);
    expect(enterHive(h, 4)).toBe(false);
  });

  it('leaveHive returns FIFO order', () => {
    const h = makeBeehive();
    enterHive(h, 10);
    enterHive(h, 20);
    expect(leaveHive(h)).toBe(10);
    expect(leaveHive(h)).toBe(20);
  });

  it('pollination raises honey level up to 5', () => {
    const h = makeBeehive();
    for (let i = 0; i < 10; i++) addPollination(h);
    expect(h.honeyLevel).toBe(5);
  });

  it('shears harvest at full produces 3 honeycombs + agitates (wiki)', () => {
    const h = makeBeehive();
    h.honeyLevel = 5;
    const r = harvest(h, { useBottle: false, campfireBelow: false });
    expect(r.drop).toEqual({ item: 'webmc:honeycomb', count: 3 });
    expect(r.agitated).toBe(true);
  });

  it('bottle + campfire below is non-agitating', () => {
    const h = makeBeehive();
    h.honeyLevel = 5;
    const r = harvest(h, { useBottle: true, campfireBelow: true });
    expect(r.drop).toEqual({ item: 'webmc:honey_bottle', count: 1 });
    expect(r.agitated).toBe(false);
  });

  it('no harvest at honey level < 5', () => {
    const h = makeBeehive();
    h.honeyLevel = 3;
    const r = harvest(h, { useBottle: false, campfireBelow: false });
    expect(r.drop).toBeNull();
  });
});
