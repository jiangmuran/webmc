import { describe, it, expect } from 'vitest';
import { bonemealOutputs, spreadsToNetherrack } from './nylium_spread_bonemeal';

describe('nylium spread/bonemeal', () => {
  it('warped outputs warped flora', () => {
    const out = bonemealOutputs('warped_nylium', () => 0.1);
    expect(out.some((x) => x.startsWith('warped'))).toBe(true);
  });

  it('crimson outputs crimson flora', () => {
    const out = bonemealOutputs('crimson_nylium', () => 0.1);
    expect(out.some((x) => x.startsWith('crimson'))).toBe(true);
  });

  it('outputs non-empty', () => {
    const out = bonemealOutputs('warped_nylium', () => 0);
    expect(out.length).toBeGreaterThan(0);
  });

  it('adjacent nylium spreads', () => {
    expect(spreadsToNetherrack(1)).toBe(true);
  });

  it('no nylium no spread', () => {
    expect(spreadsToNetherrack(0)).toBe(false);
  });
});
