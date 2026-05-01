import { describe, it, expect } from 'vitest';
import { flammabilityOf, isFlammable, registerFlammable, tickFire } from './fire_spread';

describe('fire spread', () => {
  it('stone is not flammable', () => {
    expect(isFlammable('webmc:stone')).toBe(false);
  });

  it('wool is very flammable', () => {
    const def = flammabilityOf('webmc:wool');
    expect(def.encouragement).toBeGreaterThan(0);
  });

  it('ages on tick', () => {
    const r = tickFire({
      pos: { x: 0, y: 0, z: 0 },
      age: 0,
      fireTickAllowed: true,
      humidity: 0,
      neighborAt: () => 'webmc:stone',
      rng: () => 0.5,
    });
    expect(r.newAge).toBe(1);
  });

  it('does not age when fireTick disabled', () => {
    const r = tickFire({
      pos: { x: 0, y: 0, z: 0 },
      age: 5,
      fireTickAllowed: false,
      humidity: 0,
      neighborAt: () => 'webmc:stone',
      rng: () => 0.5,
    });
    expect(r.newAge).toBe(5);
    expect(r.ignitions).toEqual([]);
  });

  it('ignites flammable neighbor on low roll', () => {
    const r = tickFire({
      pos: { x: 0, y: 0, z: 0 },
      age: 0,
      fireTickAllowed: true,
      humidity: 0,
      neighborAt: () => 'webmc:wool',
      rng: () => 0.001,
    });
    expect(r.ignitions.length).toBeGreaterThan(0);
  });

  it('registerFlammable extends table', () => {
    registerFlammable('webmc:test', { encouragement: 10, flammability: 20 });
    expect(isFlammable('webmc:test')).toBe(true);
  });

  it('age-15 fire extinguishes ~25% per tick (wiki: 1/4)', () => {
    // rand=0.24 < 0.25 → extinguish; rand=0.25 → don't
    const r1 = tickFire({
      pos: { x: 0, y: 0, z: 0 },
      age: 14, // becomes 15 after tick
      fireTickAllowed: true,
      humidity: 0,
      neighborAt: () => 'webmc:stone',
      rng: () => 0.24,
    });
    expect(r1.extinguish).toBe(true);
    const r2 = tickFire({
      pos: { x: 0, y: 0, z: 0 },
      age: 14,
      fireTickAllowed: true,
      humidity: 0,
      neighborAt: () => 'webmc:stone',
      rng: () => 0.25,
    });
    expect(r2.extinguish).toBe(false);
  });
});
