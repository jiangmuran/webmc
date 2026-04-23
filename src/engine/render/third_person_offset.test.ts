import { describe, it, expect } from 'vitest';
import { desiredOffset, pullbackOnHit, THIRD_PERSON_DISTANCE } from './third_person_offset';

describe('third person offset', () => {
  it('first person zero', () => {
    expect(desiredOffset('first', 0, 0)).toEqual({ x: 0, y: 0, z: 0 });
  });

  it('back camera distance', () => {
    const o = desiredOffset('third_back', 0, 0);
    expect(Math.hypot(o.x, o.y, o.z)).toBeCloseTo(THIRD_PERSON_DISTANCE);
  });

  it('front camera flips', () => {
    const back = desiredOffset('third_back', 0, 0);
    const front = desiredOffset('third_front', 0, 0);
    expect(front.z).toBeCloseTo(-back.z);
  });

  it('pullback shortens', () => {
    const o = { x: 0, y: 0, z: 4 };
    const r = pullbackOnHit(o, 2);
    expect(Math.hypot(r.x, r.y, r.z)).toBeLessThan(4);
  });
});
