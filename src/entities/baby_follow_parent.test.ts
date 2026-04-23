import { describe, it, expect } from 'vitest';
import { followTarget, shouldUseNearestInstead, FOLLOW_RADIUS } from './baby_follow_parent';

const origin = { x: 0, y: 0, z: 0 };

describe('baby follow parent', () => {
  it('no parent no adult → null', () => {
    expect(followTarget({ babyPos: origin, parentPos: null, nearestAdultPos: null })).toBeNull();
  });

  it('follows parent when far', () => {
    const t = followTarget({
      babyPos: origin,
      parentPos: { x: 10, y: 0, z: 0 },
      nearestAdultPos: null,
    });
    expect(t).toEqual({ x: 10, y: 0, z: 0 });
  });

  it('close enough stops following', () => {
    expect(
      followTarget({ babyPos: origin, parentPos: { x: 1, y: 0, z: 0 }, nearestAdultPos: null }),
    ).toBeNull();
  });

  it('fallback to nearest adult', () => {
    const t = followTarget({
      babyPos: origin,
      parentPos: null,
      nearestAdultPos: { x: 10, y: 0, z: 0 },
    });
    expect(t).toEqual({ x: 10, y: 0, z: 0 });
  });

  it('nearest instead if parent too far', () => {
    expect(
      shouldUseNearestInstead({
        babyPos: origin,
        parentPos: { x: FOLLOW_RADIUS * 10, y: 0, z: 0 },
        nearestAdultPos: { x: 5, y: 0, z: 0 },
      }),
    ).toBe(true);
  });
});
