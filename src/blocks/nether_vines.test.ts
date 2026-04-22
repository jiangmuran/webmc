import { describe, it, expect } from 'vitest';
import { boneMealVine, growNetherVine, makeNetherVine } from './nether_vines';

describe('nether vines', () => {
  it('twisting vine grows upward', () => {
    const v = makeNetherVine('up');
    const out = growNetherVine({ x: 0, y: 64, z: 0 }, v, { hasAir: () => true }, () => 0.01);
    expect(out?.y).toBe(66);
  });

  it('weeping vine grows downward', () => {
    const v = makeNetherVine('down');
    const out = growNetherVine({ x: 0, y: 64, z: 0 }, v, { hasAir: () => true }, () => 0.01);
    expect(out?.y).toBe(62);
  });

  it('stops at maxLength', () => {
    const v = makeNetherVine('up');
    v.length = v.maxLength;
    const out = growNetherVine({ x: 0, y: 64, z: 0 }, v, { hasAir: () => true }, () => 0.01);
    expect(out).toBeNull();
  });

  it('bone meal places 1-5 new cells', () => {
    const v = makeNetherVine('up');
    const out = boneMealVine({ x: 0, y: 64, z: 0 }, v, { hasAir: () => true }, () => 0.5);
    expect(out.length).toBeGreaterThanOrEqual(1);
    expect(out.length).toBeLessThanOrEqual(5);
  });
});
