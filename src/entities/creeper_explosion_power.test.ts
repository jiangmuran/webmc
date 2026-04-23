import { describe, it, expect } from 'vitest';
import {
  currentPower,
  effectiveFuseDelta,
  tick,
  chargedByLightning,
  CREEPER_BASE_POWER,
  CHARGED_CREEPER_POWER,
} from './creeper_explosion_power';

describe('creeper explosion power', () => {
  it('charged doubles', () => {
    expect(currentPower({ charged: true, fuseTicks: 10, hasSpeedEffect: false })).toBe(
      CHARGED_CREEPER_POWER,
    );
    expect(currentPower({ charged: false, fuseTicks: 10, hasSpeedEffect: false })).toBe(
      CREEPER_BASE_POWER,
    );
  });

  it('speed doubles fuse rate', () => {
    expect(effectiveFuseDelta({ charged: false, fuseTicks: 0, hasSpeedEffect: true })).toBe(2);
  });

  it('tick explodes at 0', () => {
    expect(tick({ charged: false, fuseTicks: 1, hasSpeedEffect: false })).toBe('explode');
  });

  it('tick decrements', () => {
    const r = tick({ charged: false, fuseTicks: 30, hasSpeedEffect: false });
    if (r === 'explode') throw new Error('fail');
    expect(r.fuseTicks).toBe(29);
  });

  it('lightning charges', () => {
    expect(chargedByLightning()).toBe(true);
  });
});
