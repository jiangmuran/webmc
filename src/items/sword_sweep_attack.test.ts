import { describe, it, expect } from 'vitest';
import { sweepDamage, sweepRadius, entitiesInSweep } from './sword_sweep_attack';

describe('sword sweep attack', () => {
  it('airborne no sweep', () => {
    expect(
      sweepDamage({
        sweepingEdgeLevel: 3,
        baseDamage: 7,
        onGround: false,
        sprinting: false,
        sweepingArea: 2,
      }),
    ).toBe(0);
  });

  it('sprinting no sweep', () => {
    expect(
      sweepDamage({
        sweepingEdgeLevel: 3,
        baseDamage: 7,
        onGround: true,
        sprinting: true,
        sweepingArea: 2,
      }),
    ).toBe(0);
  });

  it('basic sweep damage', () => {
    const d = sweepDamage({
      sweepingEdgeLevel: 0,
      baseDamage: 7,
      onGround: true,
      sprinting: false,
      sweepingArea: 1,
    });
    expect(d).toBeGreaterThan(0);
  });

  it('sweeping edge amplifies', () => {
    const plain = sweepDamage({
      sweepingEdgeLevel: 0,
      baseDamage: 7,
      onGround: true,
      sprinting: false,
      sweepingArea: 1,
    });
    const strong = sweepDamage({
      sweepingEdgeLevel: 3,
      baseDamage: 7,
      onGround: true,
      sprinting: false,
      sweepingArea: 1,
    });
    expect(strong).toBeLessThanOrEqual(plain);
  });

  it('radius 1 block', () => {
    expect(sweepRadius()).toBe(1);
  });

  it('close entities included', () => {
    const hit = entitiesInSweep(0, 0, [
      { x: 0.5, z: 0, id: 'a' },
      { x: 5, z: 0, id: 'b' },
    ]);
    expect(hit.map((e) => e.id)).toEqual(['a']);
  });
});
