import { describe, it, expect } from 'vitest';
import { addFuel, makeBrewingStand, tickBrewing } from './brewing';

describe('brewing stand', () => {
  it('adds fuel up to the cap', () => {
    const s = makeBrewingStand();
    for (let i = 0; i < 25; i++) addFuel(s);
    expect(s.fuelPower).toBe(20);
  });

  it('refuses to progress without ingredient', () => {
    const s = makeBrewingStand();
    s.fuelPower = 10;
    s.bottles[0] = { contents: 'awkward' };
    const r = tickBrewing(s, 5);
    expect(r.changedBottles).toBe(false);
  });

  it('refuses to progress without fuel', () => {
    const s = makeBrewingStand();
    s.ingredient = 'webmc:glistering_melon';
    s.bottles[0] = { contents: 'awkward' };
    const r = tickBrewing(s, 5);
    expect(r.changedBottles).toBe(false);
  });

  it('completes a brew after 20s with ingredient + fuel', () => {
    const s = makeBrewingStand();
    s.fuelPower = 20;
    s.ingredient = 'webmc:glistering_melon';
    s.bottles[0] = { contents: 'awkward' };
    // One big tick past 20s should finish.
    const r = tickBrewing(s, 25);
    expect(r.changedBottles).toBe(true);
    expect(s.bottles[0].contents).toBe('healing');
    expect(s.ingredient).toBeNull();
  });

  it('brews all bottles simultaneously', () => {
    const s = makeBrewingStand();
    s.fuelPower = 20;
    s.ingredient = 'webmc:glistering_melon';
    s.bottles[0] = { contents: 'awkward' };
    s.bottles[1] = { contents: 'awkward' };
    s.bottles[2] = { contents: null };
    const r = tickBrewing(s, 25);
    expect(r.changedBottles).toBe(true);
    expect(s.bottles[0].contents).toBe('healing');
    expect(s.bottles[1].contents).toBe('healing');
    expect(s.bottles[2].contents).toBeNull();
  });

  it('refuses when no bottle would brew into anything', () => {
    const s = makeBrewingStand();
    s.fuelPower = 20;
    s.ingredient = 'webmc:rotten_flesh'; // no matching recipe
    s.bottles[0] = { contents: 'awkward' };
    const r = tickBrewing(s, 25);
    expect(r.changedBottles).toBe(false);
  });
});
