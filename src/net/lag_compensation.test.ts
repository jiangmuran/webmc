import { describe, it, expect } from 'vitest';
import {
  makeHistory,
  record,
  positionAt,
  clampLag,
  MAX_LAG_COMPENSATION_MS,
} from './lag_compensation';

describe('lag compensation', () => {
  it('positionAt picks last ≤ t', () => {
    const h = makeHistory();
    record(h, 0, 0, 0, 0);
    record(h, 100, 10, 0, 0);
    record(h, 200, 20, 0, 0);
    expect(positionAt(h, 150)?.x).toBe(10);
  });

  it('empty history null', () => {
    expect(positionAt(makeHistory(), 0)).toBeNull();
  });

  it('prunes old', () => {
    const h = makeHistory(100);
    record(h, 0, 0, 0, 0);
    record(h, 1000, 10, 0, 0);
    expect(h.samples.length).toBe(1);
  });

  it('clampLag upper bound', () => {
    expect(clampLag(10000)).toBe(MAX_LAG_COMPENSATION_MS);
    expect(clampLag(-5)).toBe(0);
  });
});
