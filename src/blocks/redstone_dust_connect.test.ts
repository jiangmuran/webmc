import { describe, it, expect } from 'vitest';
import { allConnections, dustShape, type DustQuery } from './redstone_dust_connect';

function q(overrides: Partial<DustQuery> = {}): DustQuery {
  const emptyNeighbor = {
    hasDust: false,
    hasPowerSource: false,
    isOpaqueBlock: false,
  };
  const emptyAbove = { hasDust: false, hasOpaqueAbove: false };
  const emptyBelow = { hasDust: false };
  const base: DustQuery = {
    neighbor: {
      north: { ...emptyNeighbor },
      south: { ...emptyNeighbor },
      east: { ...emptyNeighbor },
      west: { ...emptyNeighbor },
    },
    above: {
      north: { ...emptyAbove },
      south: { ...emptyAbove },
      east: { ...emptyAbove },
      west: { ...emptyAbove },
    },
    below: {
      north: { ...emptyBelow },
      south: { ...emptyBelow },
      east: { ...emptyBelow },
      west: { ...emptyBelow },
    },
    selfBlockedByOpaqueAbove: false,
  };
  return { ...base, ...overrides };
}

describe('redstone dust connect', () => {
  it('isolated dust = dot', () => {
    const c = allConnections(q());
    expect(dustShape(c)).toBe('dot');
  });

  it('ns line', () => {
    const query = q();
    query.neighbor.north.hasDust = true;
    query.neighbor.south.hasDust = true;
    expect(dustShape(allConnections(query))).toBe('ns_line');
  });

  it('cross', () => {
    const query = q();
    for (const s of ['north', 'south', 'east', 'west'] as const) {
      query.neighbor[s].hasDust = true;
    }
    expect(dustShape(allConnections(query))).toBe('cross');
  });

  it('corner', () => {
    const query = q();
    query.neighbor.north.hasDust = true;
    query.neighbor.east.hasDust = true;
    expect(dustShape(allConnections(query))).toBe('corner_ne');
  });

  it('t-shape', () => {
    const query = q();
    query.neighbor.north.hasDust = true;
    query.neighbor.south.hasDust = true;
    query.neighbor.east.hasDust = true;
    expect(dustShape(allConnections(query))).toBe('tshape_e');
  });

  it('power source connects', () => {
    const query = q();
    query.neighbor.north.hasPowerSource = true;
    const c = allConnections(query);
    expect(c.north).toBe('side');
  });
});
