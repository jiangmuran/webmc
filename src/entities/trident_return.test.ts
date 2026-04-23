import { describe, it, expect } from 'vitest';
import { shouldReturn, returnSpeed, reachedOwner } from './trident_return';

describe('trident return', () => {
  it('no loyalty no return', () => {
    expect(
      shouldReturn({
        loyaltyLevel: 0,
        thrownPos: { x: 0, y: 0, z: 0 },
        ownerPos: { x: 0, y: 0, z: 0 },
        nowTick: 1000,
        thrownAtTick: 0,
      }),
    ).toBe(false);
  });

  it('returns with loyalty after delay', () => {
    expect(
      shouldReturn({
        loyaltyLevel: 1,
        thrownPos: { x: 10, y: 0, z: 0 },
        ownerPos: { x: 0, y: 0, z: 0 },
        nowTick: 100,
        thrownAtTick: 0,
      }),
    ).toBe(true);
  });

  it('higher loyalty faster', () => {
    const base = {
      thrownPos: { x: 0, y: 0, z: 0 },
      ownerPos: { x: 0, y: 0, z: 0 },
      nowTick: 100,
      thrownAtTick: 0,
    };
    expect(returnSpeed({ ...base, loyaltyLevel: 3 })).toBeGreaterThan(
      returnSpeed({ ...base, loyaltyLevel: 1 }),
    );
  });

  it('detects arrival', () => {
    expect(
      reachedOwner({
        loyaltyLevel: 1,
        thrownPos: { x: 0, y: 0, z: 0 },
        ownerPos: { x: 0.5, y: 0, z: 0 },
        nowTick: 0,
        thrownAtTick: 0,
      }),
    ).toBe(true);
  });
});
