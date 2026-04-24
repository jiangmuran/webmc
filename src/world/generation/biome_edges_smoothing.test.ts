import { describe, it, expect } from 'vitest';
import { blend, isEdge, edgeInterp, type BiomeSample } from './biome_edges_smoothing';

const hot: BiomeSample = { biome: 'desert', temperature: 2, humidity: 0 };
const cold: BiomeSample = { biome: 'taiga', temperature: 0.25, humidity: 0.8 };

describe('biome edge smoothing', () => {
  it('half blend averages temp', () => {
    const b = blend(hot, cold, 0.5);
    expect(b.temperature).toBeCloseTo(1.125);
  });

  it('blend picks dominant biome', () => {
    expect(blend(hot, cold, 0.1).biome).toBe('desert');
    expect(blend(hot, cold, 0.9).biome).toBe('taiga');
  });

  it('edge detected', () => {
    expect(isEdge(hot, [cold])).toBe(true);
  });

  it('no edge when same biome', () => {
    expect(isEdge(hot, [hot])).toBe(false);
  });

  it('edge interp pulls temp', () => {
    const r = edgeInterp(hot, [cold]);
    expect(r.temperature).toBeGreaterThan(cold.temperature);
    expect(r.temperature).toBeLessThan(hot.temperature);
  });
});
