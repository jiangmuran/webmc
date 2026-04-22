import { describe, it, expect } from 'vitest';
import { pickupIndicator, pickupOpacity, renderCrosshair, tickPickupIndicator } from './crosshair';

const BASE = {
  targetKind: 'none' as const,
  targetIsHostile: false,
  targetIsDead: false,
  attackCooldown: 1,
  spectatorMode: false,
};

describe('crosshair', () => {
  it('default visible', () => {
    expect(renderCrosshair(BASE).visible).toBe(true);
  });

  it('spectator hides', () => {
    expect(renderCrosshair({ ...BASE, spectatorMode: true }).visible).toBe(false);
  });

  it('hostile target = hostile color', () => {
    expect(renderCrosshair({ ...BASE, targetKind: 'entity', targetIsHostile: true }).color).toBe(
      'hostile',
    );
  });

  it('friendly target', () => {
    expect(renderCrosshair({ ...BASE, targetKind: 'entity', targetIsHostile: false }).color).toBe(
      'friendly',
    );
  });

  it('dead target', () => {
    expect(renderCrosshair({ ...BASE, targetIsDead: true }).color).toBe('dead');
  });

  it('cooldown < 1 shows ring', () => {
    expect(renderCrosshair({ ...BASE, attackCooldown: 0.5 }).showAttackRing).toBe(true);
  });
});

describe('pickup indicator', () => {
  it('starts full', () => {
    const p = pickupIndicator('webmc:dirt', 5);
    expect(pickupOpacity(p)).toBe(1);
  });

  it('fades over time', () => {
    const p = pickupIndicator('webmc:dirt', 5);
    tickPickupIndicator(p, 1);
    expect(pickupOpacity(p)).toBeCloseTo(0.5);
  });

  it('expires after duration', () => {
    const p = pickupIndicator('webmc:dirt', 5);
    expect(tickPickupIndicator(p, 3)).toBe(false);
  });
});
