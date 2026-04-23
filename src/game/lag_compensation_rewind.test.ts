import { describe, it, expect } from 'vitest';
import { rewindToTick, prunedHistory } from './lag_compensation_rewind';

const hist = [
  { tick: 10, positions: {} },
  { tick: 20, positions: {} },
  { tick: 30, positions: {} },
];

describe('lag compensation rewind', () => {
  it('finds exact tick', () => {
    expect(rewindToTick(hist, 20)?.tick).toBe(20);
  });

  it('rounds down', () => {
    expect(rewindToTick(hist, 25)?.tick).toBe(20);
  });

  it('before start = undefined', () => {
    expect(rewindToTick(hist, 5)).toBeUndefined();
  });

  it('prune by age', () => {
    expect(prunedHistory(hist, 10)).toHaveLength(2);
  });
});
