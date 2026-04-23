import { describe, it, expect } from 'vitest';
import { shouldCompress, estimateSaving, invalidThresholdDisables } from './compression_threshold';

describe('compression threshold', () => {
  it('big packets compress', () => {
    expect(shouldCompress(512)).toBe(true);
  });

  it('tiny packets skip', () => {
    expect(shouldCompress(10)).toBe(false);
  });

  it('custom threshold', () => {
    expect(shouldCompress(100, 50)).toBe(true);
  });

  it('savings non-negative', () => {
    expect(estimateSaving(100, 40)).toBe(60);
    expect(estimateSaving(10, 20)).toBe(0);
  });

  it('non-positive disables', () => {
    expect(invalidThresholdDisables(0)).toBe(true);
    expect(invalidThresholdDisables(-1)).toBe(true);
    expect(invalidThresholdDisables(100)).toBe(false);
  });
});
