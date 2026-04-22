import { describe, it, expect } from 'vitest';
import { arrowDamage, FLAME_BURN_SEC, isFireImmune, onFlameArrowHit } from './arrow_flame';

describe('flame arrow', () => {
  it('no flame enchant = no burn', () => {
    expect(
      onFlameArrowHit({ flameLevel: 0, powerLevel: 3, targetIsFireImmune: false }).applied,
    ).toBe(false);
  });

  it('flame ignites target for 5s', () => {
    const r = onFlameArrowHit({ flameLevel: 1, powerLevel: 0, targetIsFireImmune: false });
    expect(r.burnDurationSec).toBe(FLAME_BURN_SEC);
    expect(r.applied).toBe(true);
  });

  it('fire-immune target ignores flame', () => {
    expect(
      onFlameArrowHit({ flameLevel: 1, powerLevel: 0, targetIsFireImmune: true }).applied,
    ).toBe(false);
  });

  it('arrow damage scales with velocity', () => {
    expect(arrowDamage(0, 1, false)).toBeGreaterThan(0);
    expect(arrowDamage(0, 2, false)).toBeGreaterThan(arrowDamage(0, 0.5, false));
  });

  it('blaze is fire-immune', () => {
    expect(isFireImmune('blaze')).toBe(true);
  });

  it('cow is not', () => {
    expect(isFireImmune('cow')).toBe(false);
  });
});
