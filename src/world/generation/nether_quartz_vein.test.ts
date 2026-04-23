import { describe, it, expect } from 'vitest';
import { rollSize, rollY, inNetherrackOnly, VEIN_SIZE_MIN, VEIN_SIZE_MAX } from './nether_quartz_vein';

describe('nether quartz vein', () => {
  it('size in range', () => {
    const s = rollSize(() => 0.5);
    expect(s).toBeGreaterThanOrEqual(VEIN_SIZE_MIN);
    expect(s).toBeLessThanOrEqual(VEIN_SIZE_MAX);
  });

  it('y in range', () => {
    const y = rollY(() => 0.5);
    expect(y).toBeGreaterThanOrEqual(10);
    expect(y).toBeLessThanOrEqual(117);
  });

  it('replaces only netherrack', () => {
    expect(inNetherrackOnly()).toBe(true);
  });
});
