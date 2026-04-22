import { describe, it, expect } from 'vitest';
import {
  activatorEffect,
  computeRailShape,
  POWERED_RAIL_PROPAGATION_LIMIT,
  poweredRailEnergized,
} from './rails_slope';

const EMPTY = {
  kind: 'rail' as const,
  north: false,
  south: false,
  east: false,
  west: false,
  northHigher: false,
  southHigher: false,
  eastHigher: false,
  westHigher: false,
};

describe('rail shape', () => {
  it('isolated = north_south default', () => {
    expect(computeRailShape(EMPTY)).toBe('north_south');
  });

  it('E+W = east_west', () => {
    expect(computeRailShape({ ...EMPTY, east: true, west: true })).toBe('east_west');
  });

  it('curve SE for rail', () => {
    expect(computeRailShape({ ...EMPTY, south: true, east: true })).toBe('south_east');
  });

  it('powered rail has no curves', () => {
    expect(
      computeRailShape({
        ...EMPTY,
        kind: 'powered_rail',
        south: true,
        east: true,
      }),
    ).toBe('north_south');
  });

  it('ascending takes priority', () => {
    expect(
      computeRailShape({
        ...EMPTY,
        south: true,
        northHigher: true,
      }),
    ).toBe('ascending_north');
  });
});

describe('powered rail chain', () => {
  it('direct power energizes', () => {
    expect(poweredRailEnergized({ direct: true, prevEnergized: false, chainDistance: 0 })).toBe(
      true,
    );
  });

  it('chain within limit propagates', () => {
    expect(poweredRailEnergized({ direct: false, prevEnergized: true, chainDistance: 5 })).toBe(
      true,
    );
  });

  it('beyond limit = off', () => {
    expect(
      poweredRailEnergized({
        direct: false,
        prevEnergized: true,
        chainDistance: POWERED_RAIL_PROPAGATION_LIMIT,
      }),
    ).toBe(false);
  });
});

describe('activator rail', () => {
  it('powered ejects + detonates', () => {
    const r = activatorEffect(true);
    expect(r.ejectRiders).toBe(true);
    expect(r.detonateTntCart).toBe(true);
  });

  it('unpowered does nothing', () => {
    expect(activatorEffect(false).ejectRiders).toBe(false);
  });
});
