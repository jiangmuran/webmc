import { describe, it, expect } from 'vitest';
import {
  makeBreeze,
  damageBreeze,
  tryChargeWindCharge,
  knockbackVector,
  CHARGE_COOLDOWN_MS,
  WIND_CHARGE_KNOCKBACK,
} from './breeze_wind_attack';

describe('breeze', () => {
  it('projectile immune', () => {
    const b = makeBreeze();
    expect(damageBreeze(b, { amount: 5, kind: 'projectile' })).toBe(0);
    expect(b.hp).toBe(b.maxHp);
  });

  it('melee hurts', () => {
    const b = makeBreeze();
    damageBreeze(b, { amount: 3, kind: 'melee' });
    expect(b.hp).toBe(b.maxHp - 3);
  });

  it('charge cooldown', () => {
    const b = makeBreeze();
    expect(tryChargeWindCharge(b, { nowMs: 0, targetInRange: true })).toBe(true);
    expect(tryChargeWindCharge(b, { nowMs: 100, targetInRange: true })).toBe(false);
    expect(tryChargeWindCharge(b, { nowMs: CHARGE_COOLDOWN_MS + 1, targetInRange: true })).toBe(
      true,
    );
  });

  it('knockback magnitude', () => {
    const k = knockbackVector(1, 0, 0);
    expect(k.x).toBeCloseTo(WIND_CHARGE_KNOCKBACK);
  });
});
