import { describe, it, expect } from 'vitest';
import { computeCameraPose, cyclePerspective, makeCamera } from './player_camera';

describe('player camera', () => {
  it('cycle wraps', () => {
    const c = makeCamera();
    expect(cyclePerspective(c)).toBe('third_back');
    expect(cyclePerspective(c)).toBe('third_front');
    expect(cyclePerspective(c)).toBe('first');
  });

  it('first person camera at eye', () => {
    const c = makeCamera();
    const r = computeCameraPose({
      state: c,
      playerPos: { x: 0, y: 60, z: 0 },
      playerEyeHeight: 1.62,
      yawRad: 0,
      pitchRad: 0,
      isBlocked: () => false,
    });
    expect(r.firstPerson).toBe(true);
    expect(r.position.y).toBeCloseTo(61.62);
  });

  it('third person back moves camera behind', () => {
    const c = makeCamera();
    cyclePerspective(c);
    const r = computeCameraPose({
      state: c,
      playerPos: { x: 0, y: 60, z: 0 },
      playerEyeHeight: 1.62,
      yawRad: 0,
      pitchRad: 0,
      isBlocked: () => false,
    });
    expect(r.position.z).toBeLessThan(0);
    expect(r.firstPerson).toBe(false);
  });

  it('collision pulls camera closer', () => {
    const c = makeCamera();
    cyclePerspective(c);
    const r = computeCameraPose({
      state: c,
      playerPos: { x: 0, y: 60, z: 0 },
      playerEyeHeight: 1.62,
      yawRad: 0,
      pitchRad: 0,
      isBlocked: () => true,
    });
    // With collision, distance from eye should be reduced.
    expect(Math.abs(r.position.z)).toBeLessThan(4);
  });

  it('third person front flips forward', () => {
    const c = makeCamera();
    cyclePerspective(c);
    cyclePerspective(c); // third_front
    const r = computeCameraPose({
      state: c,
      playerPos: { x: 0, y: 60, z: 0 },
      playerEyeHeight: 1.62,
      yawRad: 0,
      pitchRad: 0,
      isBlocked: () => false,
    });
    expect(r.forward.z).toBeLessThan(0);
  });
});
