import { describe, it, expect } from 'vitest';
import {
  onDeflectedAttack,
  isVulnerableToArrows,
  STUN_DURATION,
  STUN_CHANCE_PER_BLOCK,
} from './ravager_stun_shield_detail';

describe('ravager stun shield detail', () => {
  it('deflect increments count', () => {
    const r = onDeflectedAttack(
      { stunned: false, stunTicksRemaining: 0, shieldDeflectCount: 0 },
      () => 1, // rng above threshold → no stun
    );
    expect(r.shieldDeflectCount).toBe(1);
  });

  it('single block has 50% chance to stun (wiki)', () => {
    expect(STUN_CHANCE_PER_BLOCK).toBe(0.5);
    const r = onDeflectedAttack(
      { stunned: false, stunTicksRemaining: 0, shieldDeflectCount: 0 },
      () => 0.1,
    );
    expect(r.stunned).toBe(true);
    expect(r.stunTicksRemaining).toBe(STUN_DURATION);
  });

  it('rng above 0.5 → no stun even after many blocks (wiki: per-block coin)', () => {
    const r = onDeflectedAttack(
      { stunned: false, stunTicksRemaining: 0, shieldDeflectCount: 5 },
      () => 0.9,
    );
    expect(r.stunned).toBe(false);
  });

  it('stunned vulnerable', () => {
    expect(
      isVulnerableToArrows({ stunned: true, stunTicksRemaining: 10, shieldDeflectCount: 3 }),
    ).toBe(true);
  });
});
