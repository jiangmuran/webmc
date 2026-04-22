import { describe, it, expect } from 'vitest';
import {
  campfireContactDamage,
  makeCampfire,
  makeCook,
  placeFood,
  smokeEmission,
  tickCook,
} from './campfire_smoke';

describe('campfire smoke', () => {
  it('lit campfire emits', () => {
    const c = makeCampfire();
    expect(smokeEmission(c).density).toBeGreaterThan(0);
  });

  it('signal fire reaches higher', () => {
    const c = makeCampfire();
    c.signalFire = true;
    expect(smokeEmission(c).height).toBe(24);
  });

  it('soul campfire blue tint', () => {
    const c = makeCampfire('soul_campfire');
    expect(smokeEmission(c).colorTint).toBe('blue');
  });

  it('unlit emits nothing', () => {
    const c = makeCampfire();
    c.lit = false;
    expect(smokeEmission(c).density).toBe(0);
  });

  it('4-slot cook', () => {
    const c = makeCook();
    for (let i = 0; i < 4; i++) expect(placeFood(c, 'webmc:raw_beef')).toBe(i);
    expect(placeFood(c, 'webmc:raw_beef')).toBe(-1);
  });

  it('tick cooks food', () => {
    const c = makeCook();
    placeFood(c, 'webmc:raw_beef');
    const finished = tickCook(c, 30);
    expect(finished).toContain(0);
  });

  it('contact damage', () => {
    expect(campfireContactDamage('campfire', 1)).toBe(2);
    expect(campfireContactDamage('soul_campfire', 1)).toBe(4);
  });
});
