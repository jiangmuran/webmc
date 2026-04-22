import { describe, it, expect } from 'vitest';
import { isInsideLake, lakeChance, planLake } from './lake';

describe('lake', () => {
  it('water is common', () => {
    expect(planLake({ rng: () => 0.5, biomeTemperature: 0.8 }).fluid).toBe('water');
  });

  it('lava is rare', () => {
    expect(planLake({ rng: () => 0.95, biomeTemperature: 0.8 }).fluid).toBe('lava');
  });

  it('ice cap in cold biomes', () => {
    const l = planLake({ rng: () => 0.5, biomeTemperature: 0.0 });
    expect(l.iceCap).toBe(true);
  });

  it('desert lake rare', () => {
    expect(lakeChance('desert', 'water')).toBeLessThan(lakeChance('plains', 'water'));
  });

  it('lava lake rarest', () => {
    expect(lakeChance('plains', 'lava')).toBeLessThan(lakeChance('plains', 'water'));
  });

  it('inside/outside classification', () => {
    const layout = {
      fluid: 'water' as const,
      diameter: 10,
      depth: 4,
      iceCap: false,
    };
    const center = { x: 0, y: 0, z: 0 };
    expect(isInsideLake({ x: 0, y: 0, z: 0 }, center, layout)).toBe(true);
    expect(isInsideLake({ x: 100, y: 0, z: 0 }, center, layout)).toBe(false);
  });
});
