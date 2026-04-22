import { describe, it, expect } from 'vitest';
import {
  CONN_EAST,
  CONN_NORTH,
  CONN_SOUTH,
  CONN_WEST,
  computePaneConnections,
  computeWallState,
  isStraightPane,
  type ConnectionLookup,
} from './glass_pane_connect';

const NONE: ConnectionLookup = {
  isSolid: () => false,
  isSameKind: () => false,
  isPane: () => false,
};

describe('pane connections', () => {
  it('isolated pane has no connections', () => {
    expect(computePaneConnections(NONE)).toBe(0);
  });

  it('solid neighbor north connects', () => {
    const l: ConnectionLookup = {
      ...NONE,
      isSolid: (_, __, dz) => dz === -1,
    };
    const mask = computePaneConnections(l);
    expect(mask & CONN_NORTH).toBe(CONN_NORTH);
  });

  it('all-around neighbors connects 4', () => {
    const l: ConnectionLookup = { ...NONE, isPane: () => true };
    const mask = computePaneConnections(l);
    expect(mask).toBe(CONN_NORTH | CONN_SOUTH | CONN_EAST | CONN_WEST);
  });

  it('straight N-S pane', () => {
    expect(isStraightPane(CONN_NORTH | CONN_SOUTH)).toBe(true);
  });

  it('crossed pane is not straight', () => {
    expect(isStraightPane(CONN_NORTH | CONN_EAST)).toBe(false);
  });

  it('wall with no connections = post up', () => {
    expect(computeWallState(NONE, false).postUp).toBe(true);
  });

  it('wall with block above = post up', () => {
    expect(computeWallState(NONE, true).postUp).toBe(true);
  });
});
