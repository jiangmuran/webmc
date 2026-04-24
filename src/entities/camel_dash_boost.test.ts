import { describe, it, expect } from 'vitest';
import {
  canDash,
  startDash,
  tick,
  DASH_COOLDOWN_TICKS,
  DASH_VELOCITY,
  type CamelState,
} from './camel_dash_boost';

const idle: CamelState = { saddled: true, isSitting: false, dashCooldownTicks: 0, currentSpeed: 0 };

describe('camel dash boost', () => {
  it('saddled and idle can dash', () => {
    expect(canDash(idle)).toBe(true);
  });

  it('unsaddled no dash', () => {
    expect(canDash({ ...idle, saddled: false })).toBe(false);
  });

  it('sitting no dash', () => {
    expect(canDash({ ...idle, isSitting: true })).toBe(false);
  });

  it('cooldown blocks', () => {
    expect(canDash({ ...idle, dashCooldownTicks: 5 })).toBe(false);
  });

  it('dash burst speed', () => {
    expect(startDash(idle).currentSpeed).toBe(DASH_VELOCITY);
  });

  it('dash sets cooldown', () => {
    expect(startDash(idle).dashCooldownTicks).toBe(DASH_COOLDOWN_TICKS);
  });

  it('tick reduces cooldown', () => {
    expect(tick({ ...idle, dashCooldownTicks: 10 }).dashCooldownTicks).toBe(9);
  });
});
