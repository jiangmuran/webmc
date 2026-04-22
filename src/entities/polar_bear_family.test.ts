import { describe, it, expect } from 'vitest';
import { onPolarBearAttacked, provoke, type PolarBear } from './polar_bear_family';

function bears(): PolarBear[] {
  return [
    { id: 1, isCub: false, provoked: false },
    { id: 2, isCub: false, provoked: false },
    { id: 3, isCub: true, provoked: false },
  ];
}

describe('polar bear family', () => {
  it('hitting cub provokes all adults', () => {
    const list = bears();
    const ids = onPolarBearAttacked({
      attackerId: 99,
      targetBearId: 3,
      bears: list,
      revengeRadiusCheck: () => true,
    });
    expect(ids).toContain(1);
    expect(ids).toContain(2);
  });

  it('hitting lone adult provokes only in-range adults', () => {
    const list = bears();
    const ids = onPolarBearAttacked({
      attackerId: 99,
      targetBearId: 1,
      bears: list,
      revengeRadiusCheck: (_a, b) => b.id === 1,
    });
    expect(ids).toContain(1);
  });

  it('unknown target bear → no provocation', () => {
    const ids = onPolarBearAttacked({
      attackerId: 99,
      targetBearId: 999,
      bears: bears(),
      revengeRadiusCheck: () => true,
    });
    expect(ids.length).toBe(0);
  });

  it('provoke flips provoked on listed ids', () => {
    const list = bears();
    provoke(list, [1, 2]);
    expect(list[0]?.provoked).toBe(true);
    expect(list[2]?.provoked).toBe(false);
  });
});
