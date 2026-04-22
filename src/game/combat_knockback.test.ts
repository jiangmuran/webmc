import { describe, it, expect } from 'vitest';
import { computeArrowKnockback, computeKnockback } from './combat_knockback';

describe('combat knockback', () => {
  it('pushes target along attacker→target vector', () => {
    const kb = computeKnockback({
      attackerPos: { x: 0, y: 0, z: 0 },
      targetPos: { x: 1, y: 0, z: 0 },
      sprinting: false,
      knockbackLevel: 0,
      knockbackResistance: 0,
    });
    expect(kb.x).toBeGreaterThan(0);
    expect(kb.z).toBe(0);
    expect(kb.y).toBeGreaterThan(0);
  });

  it('sprint bumps horizontal push', () => {
    const slow = computeKnockback({
      attackerPos: { x: 0, y: 0, z: 0 },
      targetPos: { x: 1, y: 0, z: 0 },
      sprinting: false,
      knockbackLevel: 0,
      knockbackResistance: 0,
    });
    const sprint = computeKnockback({
      attackerPos: { x: 0, y: 0, z: 0 },
      targetPos: { x: 1, y: 0, z: 0 },
      sprinting: true,
      knockbackLevel: 0,
      knockbackResistance: 0,
    });
    expect(sprint.x).toBeGreaterThan(slow.x);
  });

  it('enchant adds per-level bonus', () => {
    const noEnch = computeKnockback({
      attackerPos: { x: 0, y: 0, z: 0 },
      targetPos: { x: 1, y: 0, z: 0 },
      sprinting: false,
      knockbackLevel: 0,
      knockbackResistance: 0,
    });
    const ench = computeKnockback({
      attackerPos: { x: 0, y: 0, z: 0 },
      targetPos: { x: 1, y: 0, z: 0 },
      sprinting: false,
      knockbackLevel: 2,
      knockbackResistance: 0,
    });
    expect(ench.x).toBeGreaterThan(noEnch.x);
  });

  it('resistance 1.0 nulls all push', () => {
    const kb = computeKnockback({
      attackerPos: { x: 0, y: 0, z: 0 },
      targetPos: { x: 1, y: 0, z: 0 },
      sprinting: true,
      knockbackLevel: 3,
      knockbackResistance: 1,
    });
    expect(kb.x).toBe(0);
    expect(kb.y).toBe(0);
    expect(kb.z).toBe(0);
  });

  it('equal positions give vertical-only knockback', () => {
    const kb = computeKnockback({
      attackerPos: { x: 0, y: 0, z: 0 },
      targetPos: { x: 0, y: 0, z: 0 },
      sprinting: false,
      knockbackLevel: 0,
      knockbackResistance: 0,
    });
    expect(kb.x).toBe(0);
    expect(kb.z).toBe(0);
    expect(kb.y).toBeGreaterThan(0);
  });

  it('arrow knockback follows arrow direction', () => {
    const kb = computeArrowKnockback({
      arrowVelocity: { x: 2, y: 0, z: 0 },
      punchLevel: 0,
      knockbackResistance: 0,
    });
    expect(kb.x).toBeGreaterThan(0);
    expect(kb.z).toBe(0);
  });

  it('punch enchant amplifies arrow knockback', () => {
    const noPunch = computeArrowKnockback({
      arrowVelocity: { x: 2, y: 0, z: 0 },
      punchLevel: 0,
      knockbackResistance: 0,
    });
    const punch = computeArrowKnockback({
      arrowVelocity: { x: 2, y: 0, z: 0 },
      punchLevel: 2,
      knockbackResistance: 0,
    });
    expect(punch.x).toBeGreaterThan(noPunch.x);
  });
});
