import { describe, it, expect } from 'vitest';
import { canTransfer, onTransfer, tick, HOPPER_COOLDOWN_TICKS } from './hopper_cooldown';

describe('hopper cooldown', () => {
  it('fresh can transfer', () => {
    expect(canTransfer({ cooldownTicks: 0, locked: false })).toBe(true);
  });

  it('locked blocks', () => {
    expect(canTransfer({ cooldownTicks: 0, locked: true })).toBe(false);
  });

  it('cooldown blocks', () => {
    expect(canTransfer({ cooldownTicks: 3, locked: false })).toBe(false);
  });

  it('transfer sets cooldown', () => {
    expect(onTransfer({ cooldownTicks: 0, locked: false }).cooldownTicks).toBe(
      HOPPER_COOLDOWN_TICKS,
    );
  });

  it('tick decrements', () => {
    expect(tick({ cooldownTicks: 5, locked: false }).cooldownTicks).toBe(4);
  });

  it('tick at 0 stays 0', () => {
    expect(tick({ cooldownTicks: 0, locked: false }).cooldownTicks).toBe(0);
  });
});
