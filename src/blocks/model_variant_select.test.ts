import { describe, it, expect } from 'vitest';
import { variantMatches, selectVariant } from './model_variant_select';

describe('model variant select', () => {
  it('matcher all keys', () => {
    expect(
      variantMatches(
        { matcher: { facing: 'north', open: 'true' }, model: 'm1', weight: 1 },
        { facing: 'north', open: 'true' },
      ),
    ).toBe(true);
  });

  it('mismatch fails', () => {
    expect(
      variantMatches({ matcher: { facing: 'north' }, model: 'm', weight: 1 }, { facing: 'east' }),
    ).toBe(false);
  });

  it('selects from matching variants', () => {
    const v = selectVariant(
      [
        { matcher: { facing: 'north' }, model: 'a', weight: 1 },
        { matcher: { facing: 'south' }, model: 'b', weight: 1 },
      ],
      { facing: 'north' },
      () => 0,
    );
    expect(v?.model).toBe('a');
  });

  it('weighted pick at high roll', () => {
    const v = selectVariant(
      [
        { matcher: { facing: 'north' }, model: 'a', weight: 1 },
        { matcher: { facing: 'north' }, model: 'b', weight: 9 },
      ],
      { facing: 'north' },
      () => 0.9,
    );
    expect(v?.model).toBe('b');
  });

  it('no match returns null', () => {
    expect(selectVariant([], { facing: 'north' }, () => 0)).toBeNull();
  });
});
