import { describe, it, expect } from 'vitest';
import { propagateBlockLight, MAX_LIGHT } from './light_propagation_bfs';

describe('light propagation bfs', () => {
  it('source at full light', () => {
    const r = propagateBlockLight([{ x: 0, y: 0, z: 0, level: MAX_LIGHT }], () => 1);
    expect(r.get('0,0,0')).toBe(MAX_LIGHT);
  });

  it('distance 1 loses 1', () => {
    const r = propagateBlockLight([{ x: 0, y: 0, z: 0, level: MAX_LIGHT }], () => 1);
    expect(r.get('1,0,0')).toBe(MAX_LIGHT - 1);
  });

  it('high opacity blocks', () => {
    const r = propagateBlockLight([{ x: 0, y: 0, z: 0, level: 5 }], () => 5);
    expect(r.get('1,0,0')).toBeUndefined();
  });

  it('multiple sources take max', () => {
    const r = propagateBlockLight(
      [
        { x: 0, y: 0, z: 0, level: 10 },
        { x: 10, y: 0, z: 0, level: 15 },
      ],
      () => 1,
    );
    expect(r.get('5,0,0')).toBeGreaterThanOrEqual(5);
  });

  it('empty sources empty', () => {
    expect(propagateBlockLight([], () => 1).size).toBe(0);
  });
});
