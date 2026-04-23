import { describe, it, expect } from 'vitest';
import {
  onDeflectedAttack,
  isVulnerableToArrows,
  STUN_DURATION,
} from './ravager_stun_shield_detail';

describe('ravager stun shield detail', () => {
  it('first deflect counts', () => {
    const r = onDeflectedAttack({ stunned: false, stunTicksRemaining: 0, shieldDeflectCount: 0 });
    expect(r.shieldDeflectCount).toBe(1);
  });

  it('third deflect stuns', () => {
    const r = onDeflectedAttack({ stunned: false, stunTicksRemaining: 0, shieldDeflectCount: 2 });
    expect(r.stunned).toBe(true);
    expect(r.stunTicksRemaining).toBe(STUN_DURATION);
  });

  it('stunned vulnerable', () => {
    expect(
      isVulnerableToArrows({ stunned: true, stunTicksRemaining: 10, shieldDeflectCount: 3 }),
    ).toBe(true);
  });
});
