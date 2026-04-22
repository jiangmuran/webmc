import { describe, it, expect } from 'vitest';
import {
  applyCampfireSmoke,
  bottleHoney,
  makeNest,
  onBeeReturn,
  shearNest,
} from './bee_nest_populate';

describe('bee nest', () => {
  it('capacity 3', () => {
    const n = makeNest();
    expect(n.capacity).toBe(3);
  });

  it('pollen bee raises honey', () => {
    const n = makeNest();
    const r = onBeeReturn(n, { beeCarriesPollen: true });
    expect(r.honeyDelta).toBe(1);
    expect(n.honeyLevel).toBe(1);
  });

  it('full hive refuses bee', () => {
    const n = makeNest();
    n.occupants = 3;
    expect(onBeeReturn(n, { beeCarriesPollen: true }).accepted).toBe(false);
  });

  it('shear at honey 5 drops 3 combs', () => {
    const n = makeNest();
    n.honeyLevel = 5;
    const r = shearNest(n, { toolIsShears: true, playerSafe: true });
    expect(r.honeycombsDropped).toBe(3);
    expect(n.honeyLevel).toBe(0);
  });

  it('shear without campfire angers bees', () => {
    const n = makeNest();
    n.honeyLevel = 5;
    const r = shearNest(n, { toolIsShears: true, playerSafe: false });
    expect(r.beesAngered).toBe(true);
  });

  it('campfire smoke pacifies', () => {
    const n = makeNest();
    n.honeyLevel = 5;
    applyCampfireSmoke(n, true);
    const r = shearNest(n, { toolIsShears: true, playerSafe: false });
    expect(r.beesAngered).toBe(false);
  });

  it('bottle honey at 5 gives 1 bottle', () => {
    const n = makeNest();
    n.honeyLevel = 5;
    const r = bottleHoney(n, { bottleCount: 1, playerSafe: true });
    expect(r.honeyBottles).toBe(1);
    expect(n.honeyLevel).toBe(0);
  });

  it('bottle refuses below honey 5', () => {
    const n = makeNest();
    n.honeyLevel = 3;
    expect(bottleHoney(n, { bottleCount: 1, playerSafe: true }).honeyBottles).toBe(0);
  });
});
