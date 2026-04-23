import { describe, it, expect } from 'vitest';
import {
  takesDamageFromWater,
  shouldTryEscape,
  MIN_TELEPORT_INTERVAL,
} from './enderman_rain_teleport';

describe('enderman rain teleport', () => {
  it('rain damages', () => {
    expect(
      takesDamageFromWater({
        inRain: true,
        inWater: false,
        onFire: false,
        lastTeleportTicks: 0,
      }),
    ).toBe(true);
  });

  it('water damages', () => {
    expect(
      takesDamageFromWater({
        inRain: false,
        inWater: true,
        onFire: false,
        lastTeleportTicks: 0,
      }),
    ).toBe(true);
  });

  it('dry no damage', () => {
    expect(
      takesDamageFromWater({
        inRain: false,
        inWater: false,
        onFire: false,
        lastTeleportTicks: 0,
      }),
    ).toBe(false);
  });

  it('fire triggers escape', () => {
    expect(
      shouldTryEscape({
        inRain: false,
        inWater: false,
        onFire: true,
        lastTeleportTicks: MIN_TELEPORT_INTERVAL,
      }),
    ).toBe(true);
  });

  it('no escape if cooldown', () => {
    expect(
      shouldTryEscape({
        inRain: true,
        inWater: false,
        onFire: false,
        lastTeleportTicks: 0,
      }),
    ).toBe(false);
  });
});
