import { describe, it, expect } from 'vitest';
import {
  makeHive,
  beeReturnsWithPollen,
  beeEnters,
  beeExits,
  harvest,
  MAX_HONEY,
} from './beehive_honey_level_grow';

describe('beehive', () => {
  it('pollen increments', () => {
    const h = makeHive();
    expect(beeReturnsWithPollen(h)).toBe(true);
    expect(h.honeyLevel).toBe(1);
  });

  it('capped at max', () => {
    const h = makeHive();
    for (let i = 0; i < MAX_HONEY + 2; i++) beeReturnsWithPollen(h);
    expect(h.honeyLevel).toBe(MAX_HONEY);
  });

  it('bees enter/exit', () => {
    const h = makeHive(2);
    expect(beeEnters(h)).toBe(true);
    expect(beeEnters(h)).toBe(true);
    expect(beeEnters(h)).toBe(false);
    expect(beeExits(h)).toBe(true);
  });

  it('harvest needs full', () => {
    const h = { honeyLevel: 3, bees: 0, maxBees: 3 };
    expect(harvest(h, { tool: 'shears', campfireBelow: false })).toBeNull();
  });

  it('shears drop honeycomb', () => {
    const h = { honeyLevel: MAX_HONEY, bees: 0, maxBees: 3 };
    const r = harvest(h, { tool: 'shears', campfireBelow: false });
    expect(r?.item).toBe('webmc:honeycomb');
    expect(r?.angersBees).toBe(true);
  });

  it('campfire prevents anger', () => {
    const h = { honeyLevel: MAX_HONEY, bees: 0, maxBees: 3 };
    const r = harvest(h, { tool: 'bottle', campfireBelow: true });
    expect(r?.angersBees).toBe(false);
  });
});
