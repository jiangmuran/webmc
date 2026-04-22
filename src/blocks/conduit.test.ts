import { describe, it, expect } from 'vitest';
import { conduitPower, conduitRange, effectsInRange, type ConduitLookup } from './conduit';

class FullFrame implements ConduitLookup {
  isActivatorBlock(x: number, y: number, z: number): boolean {
    // Every cell within the 5x5x5 shell counts.
    return Math.abs(x) <= 2 && Math.abs(y) <= 2 && Math.abs(z) <= 2;
  }
  isWater(x: number, y: number, z: number): boolean {
    return Math.abs(x) <= 1 && Math.abs(y) <= 1 && Math.abs(z) <= 1;
  }
}

class NoFrame implements ConduitLookup {
  isActivatorBlock(): boolean {
    return false;
  }
  isWater(x: number, y: number, z: number): boolean {
    return Math.abs(x) <= 1 && Math.abs(y) <= 1 && Math.abs(z) <= 1;
  }
}

describe('conduit', () => {
  it('returns 0 when no frame blocks', () => {
    const lookup = new NoFrame();
    expect(conduitPower({ x: 0, y: 0, z: 0 }, lookup)).toBe(0);
  });

  it('returns 0 when not submerged', () => {
    const lookup: ConduitLookup = {
      isActivatorBlock: () => true,
      isWater: () => false,
    };
    expect(conduitPower({ x: 0, y: 0, z: 0 }, lookup)).toBe(0);
  });

  it('counts shell blocks in full 5x5x5 frame', () => {
    const lookup = new FullFrame();
    const power = conduitPower({ x: 0, y: 0, z: 0 }, lookup);
    expect(power).toBeGreaterThan(20);
  });

  it('range scales with power and caps at 96', () => {
    expect(conduitRange(0)).toBe(0);
    expect(conduitRange(16)).toBe(16);
    expect(conduitRange(200)).toBe(96);
  });

  it('effectsInRange returns Conduit Power + Water Breathing when active', () => {
    const effs = effectsInRange(20);
    expect(effs.some((e) => e.id === 'conduit_power')).toBe(true);
    expect(effs.some((e) => e.id === 'water_breathing')).toBe(true);
  });
});
