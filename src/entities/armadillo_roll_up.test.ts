import { describe, it, expect } from 'vitest';
import { shouldRoll, immuneToDamageWhileRolled, dropsScuteOnShed } from './armadillo_roll_up';

describe('armadillo roll up', () => {
  it('rolls when scared', () => {
    expect(shouldRoll({ isScared: true, rolledTicks: 0 })).toBe(true);
  });

  it('close threat rolls', () => {
    expect(shouldRoll({ isScared: false, rolledTicks: 0, nearbyThreatDistance: 3 })).toBe(true);
  });

  it('far threat unrolled', () => {
    expect(shouldRoll({ isScared: false, rolledTicks: 0, nearbyThreatDistance: 30 })).toBe(false);
  });

  it('rolled is immune', () => {
    expect(immuneToDamageWhileRolled({ isScared: true, rolledTicks: 10 })).toBe(true);
  });

  it('scute drop rare', () => {
    expect(dropsScuteOnShed({ isScared: false, rolledTicks: 0 }, () => 0)).toBe(true);
    expect(dropsScuteOnShed({ isScared: false, rolledTicks: 0 }, () => 0.99)).toBe(false);
  });
});
