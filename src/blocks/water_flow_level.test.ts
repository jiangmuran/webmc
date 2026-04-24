import { describe, it, expect } from 'vitest';
import {
  neighborLevel,
  shouldFlowTo,
  fillableBySource,
  becomesSource,
  MAX_FLOW_LEVEL,
  type WaterCell,
} from './water_flow_level';

const src: WaterCell = { level: 0, isSource: true, falling: false };

describe('water flow level', () => {
  it('source → neighbor 1', () => {
    expect(neighborLevel(src)).toBe(1);
  });

  it('decays across distance', () => {
    const flow: WaterCell = { level: 3, isSource: false, falling: false };
    expect(neighborLevel(flow)).toBe(4);
  });

  it('rejects past max', () => {
    expect(shouldFlowTo(undefined, MAX_FLOW_LEVEL + 1)).toBe(false);
  });

  it('fills empty cell', () => {
    expect(shouldFlowTo(undefined, 3)).toBe(true);
  });

  it('does not overwrite source', () => {
    expect(shouldFlowTo(src, 1)).toBe(false);
  });

  it('two sources fillable', () => {
    expect(fillableBySource(src, src)).toBe(true);
  });

  it('new source from neighbors', () => {
    expect(becomesSource(2, true)).toBe(true);
    expect(becomesSource(2, false)).toBe(false);
  });
});
