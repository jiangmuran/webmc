import { describe, it, expect } from 'vitest';
import { canPlace, thicknessBlocks, spreadsTo, breakOnNoSupport } from './moss_carpet';

describe('moss carpet', () => {
  it('requires solid below', () => {
    expect(canPlace(true)).toBe(true);
    expect(canPlace(false)).toBe(false);
  });

  it('thin 1/16 block', () => {
    expect(thicknessBlocks()).toBeCloseTo(1 / 16);
  });

  it('spreads to dirt with air above', () => {
    expect(spreadsTo({ neighborIsDirt: true, neighborTopIsAir: true })).toBe(true);
  });

  it('no spread to stone', () => {
    expect(spreadsTo({ neighborIsDirt: false, neighborTopIsAir: true })).toBe(false);
  });

  it('breaks without support', () => {
    expect(breakOnNoSupport()).toBe(true);
  });
});
