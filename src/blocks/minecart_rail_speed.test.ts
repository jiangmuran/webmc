import { describe, it, expect } from 'vitest';
import {
  stepVelocity,
  detectorSignal,
  activatorEffect,
  MINECART_MAX_SPEED,
} from './minecart_rail_speed';

describe('minecart rails', () => {
  it('powered rail boosts', () => {
    const v1 = stepVelocity({
      velocity: 0.1,
      railBelow: { kind: 'powered', powered: true },
      occupied: true,
    });
    const v2 = stepVelocity({
      velocity: 0.1,
      railBelow: { kind: 'powered', powered: false },
      occupied: true,
    });
    expect(v1).toBeGreaterThan(v2);
  });

  it('caps at max', () => {
    const v = stepVelocity({
      velocity: 1,
      railBelow: { kind: 'powered', powered: true },
      occupied: true,
    });
    expect(v).toBe(MINECART_MAX_SPEED);
  });

  it('friction without passenger', () => {
    const v = stepVelocity({
      velocity: 0.1,
      railBelow: { kind: 'normal', powered: false },
      occupied: false,
    });
    expect(v).toBeLessThan(0.1);
  });

  it('detector signal', () => {
    expect(detectorSignal(true)).toBe(15);
    expect(detectorSignal(false)).toBe(0);
  });

  it('activator effect', () => {
    expect(activatorEffect('tnt_minecart')).toBe('ignite');
    expect(activatorEffect('hopper_minecart')).toBe('disable_pickup');
    expect(activatorEffect('regular_minecart')).toBeNull();
  });

  it('unpowered powered rail halves velocity per wiki (×0.5)', () => {
    // Wiki minecraft.wiki/w/Powered_Rail: an unpowered powered rail
    // multiplies cart velocity by 0.5 per tick. Old ×0.9 was a 10%
    // decay vs wiki's 50%.
    const v = stepVelocity({
      velocity: 0.4,
      railBelow: { kind: 'powered', powered: false },
      occupied: true,
    });
    expect(v).toBeCloseTo(0.2, 5);
  });
});
