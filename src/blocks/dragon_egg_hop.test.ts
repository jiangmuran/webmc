import { describe, it, expect } from 'vitest';
import { onHit, willFall, TELEPORT_RADIUS_XZ, MAX_TELEPORT_ATTEMPTS } from './dragon_egg_hop';

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

  it('hops 1000 attempts before giving up (wiki)', () => {
    expect(MAX_TELEPORT_ATTEMPTS).toBe(1000);
  });

  it('teleport range hits +TELEPORT_RADIUS_XZ inclusive (wiki: 31×15×31)', () => {
    let sawPos = false;
    let sawNeg = false;
    // Two attempts: first (dx=-R, dy=0, dz=0), second (dx=+R, dy=0, dz=0).
    const seq = [0, 0.5, 0.5, 0.999999, 0.5, 0.5];
    let i = 0;
    onHit(
      { x: 0, y: 64, z: 0 },
      {
        rand: () => seq[i++ % seq.length] ?? 0,
        isValid: (x) => {
          if (x === TELEPORT_RADIUS_XZ) sawPos = true;
          if (x === -TELEPORT_RADIUS_XZ) sawNeg = true;
          return false;
        },
      },
    );
    expect(sawNeg).toBe(true);
    expect(sawPos).toBe(true);
  });
});
