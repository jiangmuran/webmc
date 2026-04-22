import { describe, it, expect } from 'vitest';
import { Weather } from './weather';
import { fireTick, maybeStrike } from './lightning';

function seeded(s: number): () => number {
  let v = s >>> 0;
  return () => {
    v = (v + 0x6d2b79f5) >>> 0;
    let t = v;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('lightning', () => {
  it('no strike when weather is clear', () => {
    const weather = new Weather(seeded(1));
    weather.force('clear', 1000);
    const e = maybeStrike(1, {
      weather,
      chanceBaseline: 1,
      surfaceHeight: () => 64,
      pickColumn: () => ({ x: 0, z: 0 }),
      entitiesNear: () => [],
      rng: () => 0.1,
    });
    expect(e).toBeNull();
  });

  it('strike fires during thunder with favorable rng', () => {
    const weather = new Weather(seeded(1));
    weather.force('thunder', 1000);
    const e = maybeStrike(1, {
      weather,
      chanceBaseline: 1,
      surfaceHeight: () => 64,
      pickColumn: () => ({ x: 10, z: -5 }),
      entitiesNear: () => [],
      rng: () => 0.01,
    });
    expect(e).not.toBeNull();
    expect(e?.position).toEqual({ x: 10, y: 65, z: -5 });
    expect(e?.damage).toBe(5);
  });

  it('strike includes nearby entity ids', () => {
    const weather = new Weather(seeded(1));
    weather.force('thunder', 1000);
    const e = maybeStrike(1, {
      weather,
      chanceBaseline: 1,
      surfaceHeight: () => 64,
      pickColumn: () => ({ x: 0, z: 0 }),
      entitiesNear: () => [
        { id: 7, position: { x: 0, y: 65, z: 0 } },
        { id: 9, position: { x: 2, y: 65, z: 0 } },
      ],
      rng: () => 0.01,
    });
    expect(e?.affectedEntityIds).toEqual([7, 9]);
  });

  it('fireTick ignites flammable neighbours when rng favours', () => {
    const step = fireTick(
      { x: 0, y: 0, z: 0 },
      {
        isFlammable: () => true,
        hasAirAbove: () => true,
        rng: () => 0.01,
        spreadChance: 0.5,
        decayChance: 0.2,
      },
    );
    expect(step.ignite.length).toBeGreaterThan(0);
  });

  it('fireTick extinguishes when rng below decay', () => {
    const step = fireTick(
      { x: 0, y: 0, z: 0 },
      {
        isFlammable: () => false,
        hasAirAbove: () => true,
        rng: () => 0.05,
        spreadChance: 0,
        decayChance: 0.2,
      },
    );
    expect(step.extinguish).toBe(true);
  });
});
