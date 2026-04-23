import { describe, it, expect } from 'vitest';
import {
  speedAfterTick,
  shouldEjectOnActivator,
  MAX_SPEED_POWERED,
  type MinecartInput,
} from './minecart_rail_speed';

const z: MinecartInput = {
  railType: 'regular',
  powered: false,
  currentSpeed: 0.2,
  slope: 0,
  hasPassenger: false,
};

describe('minecart rail speed', () => {
  it('powered accelerates with passenger', () => {
    const s = speedAfterTick({ ...z, railType: 'powered', powered: true, hasPassenger: true });
    expect(s).toBeGreaterThan(z.currentSpeed);
  });

  it('unpowered powered rail brakes', () => {
    const s = speedAfterTick({ ...z, railType: 'powered', powered: false });
    expect(s).toBeLessThan(z.currentSpeed);
  });

  it('regular rail friction', () => {
    const s = speedAfterTick({ ...z });
    expect(s).toBeLessThan(z.currentSpeed);
  });

  it('caps at MAX_SPEED_POWERED', () => {
    const s = speedAfterTick({
      ...z,
      railType: 'powered',
      powered: true,
      currentSpeed: 1000,
      hasPassenger: true,
    });
    expect(s).toBe(MAX_SPEED_POWERED);
  });

  it('slope accelerates', () => {
    const down = speedAfterTick({ ...z, slope: 1 });
    const up = speedAfterTick({ ...z, slope: -1 });
    expect(down).toBeGreaterThan(up);
  });

  it('activator ejects powered passenger', () => {
    expect(
      shouldEjectOnActivator({
        ...z,
        railType: 'activator',
        powered: true,
        hasPassenger: true,
      }),
    ).toBe(true);
  });

  it('unpowered activator no eject', () => {
    expect(
      shouldEjectOnActivator({
        ...z,
        railType: 'activator',
        powered: false,
        hasPassenger: true,
      }),
    ).toBe(false);
  });
});
