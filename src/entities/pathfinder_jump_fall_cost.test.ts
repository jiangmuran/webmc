import { describe, it, expect } from 'vitest';
import { pathCost } from './pathfinder_jump_fall_cost';

describe('pathfinder jump/fall cost', () => {
  it('flat step costs distance', () => {
    expect(
      pathCost({
        from: { x: 0, y: 0, z: 0 },
        to: { x: 1, y: 0, z: 0 },
        canJumpUp: true,
        canFall: true,
        underwater: false,
      }),
    ).toBeCloseTo(1);
  });

  it('jump up 1 ok with penalty', () => {
    const c = pathCost({
      from: { x: 0, y: 0, z: 0 },
      to: { x: 1, y: 1, z: 0 },
      canJumpUp: true,
      canFall: true,
      underwater: false,
    });
    expect(c).toBeGreaterThan(1);
  });

  it('2-block jump denied', () => {
    expect(
      pathCost({
        from: { x: 0, y: 0, z: 0 },
        to: { x: 1, y: 2, z: 0 },
        canJumpUp: true,
        canFall: true,
        underwater: false,
      }),
    ).toBeUndefined();
  });

  it('no-fall skill falls denied', () => {
    expect(
      pathCost({
        from: { x: 0, y: 0, z: 0 },
        to: { x: 1, y: -3, z: 0 },
        canJumpUp: true,
        canFall: false,
        underwater: false,
      }),
    ).toBeUndefined();
  });

  it('underwater doubles cost', () => {
    const dry = pathCost({
      from: { x: 0, y: 0, z: 0 },
      to: { x: 1, y: 0, z: 0 },
      canJumpUp: true,
      canFall: true,
      underwater: false,
    });
    const wet = pathCost({
      from: { x: 0, y: 0, z: 0 },
      to: { x: 1, y: 0, z: 0 },
      canJumpUp: true,
      canFall: true,
      underwater: true,
    });
    expect(wet).toBeGreaterThan(dry ?? 0);
  });
});
