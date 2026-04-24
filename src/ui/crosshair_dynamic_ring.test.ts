import { describe, it, expect } from 'vitest';
import { attackCooldownFraction, fullPowerReady, ringAlpha } from './crosshair_dynamic_ring';

describe('crosshair dynamic ring', () => {
  it('no cooldown → fully ready', () => {
    expect(attackCooldownFraction({ ticksSinceLastSwing: 0, cooldownDurationTicks: 0 })).toBe(1);
  });

  it('half cooldown 0.5', () => {
    expect(
      attackCooldownFraction({ ticksSinceLastSwing: 10, cooldownDurationTicks: 20 }),
    ).toBeCloseTo(0.5);
  });

  it('past cooldown clamps 1', () => {
    expect(attackCooldownFraction({ ticksSinceLastSwing: 100, cooldownDurationTicks: 20 })).toBe(1);
  });

  it('full power at 90%', () => {
    expect(fullPowerReady({ ticksSinceLastSwing: 18, cooldownDurationTicks: 20 })).toBe(true);
  });

  it('not ready at 50%', () => {
    expect(fullPowerReady({ ticksSinceLastSwing: 10, cooldownDurationTicks: 20 })).toBe(false);
  });

  it('alpha equals fraction', () => {
    expect(ringAlpha({ ticksSinceLastSwing: 5, cooldownDurationTicks: 10 })).toBeCloseTo(0.5);
  });
});
