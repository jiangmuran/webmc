import { describe, it, expect } from 'vitest';
import { useFireCharge } from './fire_charge';

describe('fire charge', () => {
  it('used by player on air ignites', () => {
    const r = useFireCharge(false, {
      targetName: 'webmc:air',
      isAir: true,
      isIgnitable: false,
    });
    expect(r.ignited).toBe(true);
    expect(r.becomesFireball).toBe(false);
  });

  it('dispenser always shoots fireball', () => {
    const r = useFireCharge(true, { targetName: 'webmc:stone', isAir: false, isIgnitable: false });
    expect(r.ignited).toBe(false);
    expect(r.becomesFireball).toBe(true);
  });

  it('solid non-ignitable does nothing', () => {
    const r = useFireCharge(false, {
      targetName: 'webmc:stone',
      isAir: false,
      isIgnitable: false,
    });
    expect(r.ignited).toBe(false);
    expect(r.becomesFireball).toBe(false);
  });
});
