import { describe, it, expect } from 'vitest';
import {
  shouldExplode,
  damageToCrossbowTarget,
  elytraBoostMultiplier,
  lifeLimitTicks,
} from './firework_entity_hit';

describe('firework entity hit', () => {
  it('explodes after flight ticks', () => {
    expect(shouldExplode({ flightLevel: 1, effects: 0, ticksAlive: 10 })).toBe(true);
    expect(shouldExplode({ flightLevel: 3, effects: 0, ticksAlive: 20 })).toBe(false);
  });

  it('damage scales with effects', () => {
    expect(damageToCrossbowTarget({ flightLevel: 1, effects: 2, ticksAlive: 0 })).toBe(9);
  });

  it('higher flight more elytra boost', () => {
    expect(elytraBoostMultiplier({ flightLevel: 3, effects: 0, ticksAlive: 0 })).toBeGreaterThan(
      elytraBoostMultiplier({ flightLevel: 1, effects: 0, ticksAlive: 0 }),
    );
  });

  it('lifetime scales flight', () => {
    for (let i = 0; i < 10; i++) {
      expect(lifeLimitTicks({ flightLevel: 3, effects: 0, ticksAlive: 0 })).toBeGreaterThan(25);
    }
  });
});
