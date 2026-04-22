import { describe, it, expect } from 'vitest';
import { densityAt, ORE_DISTRIBUTIONS, oreBlockId, oreVariant } from './deepslate_ores';

describe('deepslate ores', () => {
  it('below y=0 is deepslate', () => {
    expect(oreVariant({ kind: 'iron', y: -10, rng: () => 0.5 })).toBe('deepslate');
  });

  it('above y=16 is stone', () => {
    expect(oreVariant({ kind: 'iron', y: 20, rng: () => 0.5 })).toBe('stone');
  });

  it('transition band mixes', () => {
    const roll0 = oreVariant({ kind: 'iron', y: 8, rng: () => 0 });
    const roll1 = oreVariant({ kind: 'iron', y: 8, rng: () => 0.99 });
    expect(roll0).toBe('stone');
    expect(roll1).toBe('deepslate');
  });

  it('block id includes deepslate prefix', () => {
    expect(oreBlockId('iron', 'deepslate')).toBe('webmc:deepslate_iron_ore');
    expect(oreBlockId('iron', 'stone')).toBe('webmc:iron_ore');
  });

  it('diamond peaks near y=-58', () => {
    const d = ORE_DISTRIBUTIONS.find((o) => o.kind === 'diamond');
    if (!d) throw new Error();
    expect(densityAt(d, -58)).toBeCloseTo(1);
    expect(densityAt(d, 16)).toBeGreaterThanOrEqual(0);
    expect(densityAt(d, -100)).toBe(0);
  });

  it('emerald peaks at high altitude', () => {
    const e = ORE_DISTRIBUTIONS.find((o) => o.kind === 'emerald');
    if (!e) throw new Error();
    expect(e.peakY).toBeGreaterThan(100);
  });
});
