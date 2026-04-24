import { describe, it, expect } from 'vitest';
import { useBucket, useBowl, shearMushroom } from './cow_mooshroom_shear';

describe('cow/mooshroom shear', () => {
  it('bucket cow → milk', () => {
    expect(useBucket({ cowType: 'cow', milkBucket: true }).result).toBe('milk_bucket');
  });

  it('no bucket no milk', () => {
    expect(useBucket({ cowType: 'cow', milkBucket: false }).result).toBeUndefined();
  });

  it('bowl red mooshroom → stew', () => {
    expect(useBowl({ cowType: 'mooshroom_red', milkBucket: false })).toBe('mushroom_stew');
  });

  it('bowl brown mooshroom → suspicious', () => {
    expect(useBowl({ cowType: 'mooshroom_brown', milkBucket: false })).toBe('suspicious_stew');
  });

  it('shear reveals cow', () => {
    expect(shearMushroom({ cowType: 'mooshroom_red', milkBucket: false }).newType).toBe('cow');
  });

  it('shear drops 5 mushrooms', () => {
    expect(shearMushroom({ cowType: 'mooshroom_red', milkBucket: false }).drops).toHaveLength(5);
  });

  it('shearing plain cow no-op', () => {
    expect(shearMushroom({ cowType: 'cow', milkBucket: false }).newType).toBeUndefined();
  });
});
