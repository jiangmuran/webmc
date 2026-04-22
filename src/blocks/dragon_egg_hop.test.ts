import { describe, it, expect } from 'vitest';
import { onHit, willFall, TELEPORT_RADIUS_XZ } from './dragon_egg_hop';

describe('dragon egg', () => {
  it('hit teleports', () => {
    const egg = { x: 0, y: 64, z: 0 };
    expect(onHit(egg, { rand: () => 0.5, isValid: () => true })).toBe(true);
  });

  it('bounded radius', () => {
    const egg = { x: 0, y: 64, z: 0 };
    onHit(egg, { rand: () => 0.99, isValid: () => true });
    expect(Math.abs(egg.x)).toBeLessThanOrEqual(TELEPORT_RADIUS_XZ);
  });

  it('no valid landing = no move', () => {
    const egg = { x: 0, y: 64, z: 0 };
    expect(onHit(egg, { rand: () => 0.5, isValid: () => false })).toBe(false);
    expect(egg).toEqual({ x: 0, y: 64, z: 0 });
  });

  it('falls in air', () => {
    expect(willFall('webmc:air')).toBe(true);
    expect(willFall('webmc:bedrock')).toBe(false);
  });
});
