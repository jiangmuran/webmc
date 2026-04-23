import { describe, it, expect } from 'vitest';
import { heightAt, sampleHeightField, PLAINS, MOUNTAINS } from './terrain_height_bake';

describe('terrain height bake', () => {
  it('plains shallow', () => {
    expect(heightAt(1, PLAINS)).toBe(PLAINS.base + PLAINS.amplitude);
  });

  it('mountains high', () => {
    expect(heightAt(1, MOUNTAINS)).toBeGreaterThan(150);
  });

  it('zero noise = base', () => {
    expect(heightAt(0, PLAINS)).toBe(PLAINS.base);
  });

  it('field sample produces w*h', () => {
    const f = sampleHeightField(PLAINS, () => 0.5, 0, 0, 4, 4);
    expect(f.length).toBe(16);
    for (const v of f) expect(v).toBe(PLAINS.base + 2);
  });
});
