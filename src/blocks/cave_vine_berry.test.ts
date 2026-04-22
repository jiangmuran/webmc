import { describe, it, expect } from 'vitest';
import {
  boneMealCaveVine,
  emission,
  GLOW_BERRY_HUNGER,
  GLOW_BERRY_SATURATION,
  makeVineSegment,
  pickBerries,
  tickCaveVine,
} from './cave_vine_berry';

describe('cave vine', () => {
  it('tip grows down on low roll', () => {
    const v = makeVineSegment(true);
    const r = tickCaveVine(v, { belowIsAir: true, roll: 0.05 });
    expect(r).toBe('grew_down');
    expect(v.age).toBe(1);
  });

  it('tip does not grow if blocked below', () => {
    const v = makeVineSegment(true);
    const r = tickCaveVine(v, { belowIsAir: false, roll: 0.05 });
    expect(r).not.toBe('grew_down');
  });

  it('sprouts berries', () => {
    const v = makeVineSegment(false);
    const r = tickCaveVine(v, { belowIsAir: true, roll: 0.05 });
    expect(r).toBe('sprouted_berries');
    expect(v.hasBerries).toBe(true);
  });

  it('pick berries drops 1-2', () => {
    const v = makeVineSegment(false);
    v.hasBerries = true;
    const r = pickBerries(v, () => 0);
    expect(r.picked).toBe(true);
    expect(r.count).toBeGreaterThanOrEqual(1);
    expect(v.hasBerries).toBe(false);
  });

  it('pick without berries = no-op', () => {
    const v = makeVineSegment(false);
    expect(pickBerries(v, () => 0).picked).toBe(false);
  });

  it('bone meal forces berry', () => {
    const v = makeVineSegment(false);
    expect(boneMealCaveVine(v)).toBe(true);
    expect(v.hasBerries).toBe(true);
  });

  it('emission = 14 with berries', () => {
    const v = makeVineSegment(false);
    v.hasBerries = true;
    expect(emission(v)).toBe(14);
  });

  it('glow berry food values', () => {
    expect(GLOW_BERRY_HUNGER).toBe(2);
    expect(GLOW_BERRY_SATURATION).toBe(0.4);
  });
});
