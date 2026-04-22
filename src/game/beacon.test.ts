import { describe, it, expect } from 'vitest';
import {
  beaconPower,
  beaconRange,
  canSelectPrimary,
  canSelectSecondary,
  effectsOn,
  type PyramidLookup,
} from './beacon';

describe('beacon', () => {
  it('range grows with power', () => {
    expect(beaconRange(0)).toBe(0);
    expect(beaconRange(1)).toBe(20);
    expect(beaconRange(4)).toBe(50);
  });

  it('speed is primary at power 1, strength at power 3', () => {
    expect(canSelectPrimary('speed', 1)).toBe(true);
    expect(canSelectPrimary('strength', 1)).toBe(false);
    expect(canSelectPrimary('strength', 3)).toBe(true);
  });

  it('regeneration is never primary (secondary only)', () => {
    expect(canSelectPrimary('regeneration', 4)).toBe(false);
  });

  it('secondary requires power 4 and a primary', () => {
    expect(canSelectSecondary(3, 'speed')).toBe(false);
    expect(canSelectSecondary(4, null)).toBe(false);
    expect(canSelectSecondary(4, 'speed')).toBe(true);
  });

  it('effectsOn empty if out of range', () => {
    const effs = effectsOn(
      { power: 1, primary: 'speed', secondary: null, pos: { x: 0, y: 0, z: 0 } },
      { x: 100, y: 0, z: 0 },
    );
    expect(effs.length).toBe(0);
  });

  it('effectsOn primary applied within range', () => {
    const effs = effectsOn(
      { power: 1, primary: 'speed', secondary: null, pos: { x: 0, y: 0, z: 0 } },
      { x: 5, y: 0, z: 0 },
    );
    expect(effs[0]?.id).toBe('speed');
  });

  it('power 4 + same primary+secondary → amplifier II', () => {
    const effs = effectsOn(
      { power: 4, primary: 'speed', secondary: 'speed', pos: { x: 0, y: 0, z: 0 } },
      { x: 5, y: 0, z: 0 },
    );
    expect(effs[effs.length - 1]?.amplifier).toBe(1);
  });

  it('beaconPower 0 when no pyramid', () => {
    const lookup: PyramidLookup = { blockName: () => 'webmc:air' };
    expect(beaconPower({ x: 0, y: 0, z: 0 }, lookup)).toBe(0);
  });

  it('beaconPower 2 with 2-layer iron pyramid', () => {
    const lookup: PyramidLookup = {
      blockName: (x, y, z) => {
        if (y === -1 && Math.abs(x) <= 1 && Math.abs(z) <= 1) return 'webmc:iron_block';
        if (y === -2 && Math.abs(x) <= 2 && Math.abs(z) <= 2) return 'webmc:iron_block';
        return 'webmc:air';
      },
    };
    expect(beaconPower({ x: 0, y: 0, z: 0 }, lookup)).toBe(2);
  });

  it('beaconPower 4 with full diamond pyramid', () => {
    const lookup: PyramidLookup = {
      blockName: (x, y, z) => {
        if (y >= -4 && y <= -1 && Math.abs(x) <= -y && Math.abs(z) <= -y) {
          return 'webmc:diamond_block';
        }
        return 'webmc:air';
      },
    };
    expect(beaconPower({ x: 0, y: 0, z: 0 }, lookup)).toBe(4);
  });
});
