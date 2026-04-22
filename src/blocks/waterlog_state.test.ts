import { describe, it, expect } from 'vitest';
import { isWaterloggable, computeWaterlog, onRemove } from './waterlog_state';

describe('waterlog', () => {
  it('tag list', () => {
    expect(isWaterloggable('fence')).toBe(true);
    expect(isWaterloggable('stone')).toBe(false);
  });

  it('water bucket sets', () => {
    expect(
      computeWaterlog({
        shapeTag: 'fence',
        currentlyWaterlogged: false,
        placingWaterBucket: true,
        placingBlockWithWaterPresent: false,
      }),
    ).toBe(true);
  });

  it('place with water preserves', () => {
    expect(
      computeWaterlog({
        shapeTag: 'slab',
        currentlyWaterlogged: false,
        placingWaterBucket: false,
        placingBlockWithWaterPresent: true,
      }),
    ).toBe(true);
  });

  it('non-waterloggable stays false', () => {
    expect(
      computeWaterlog({
        shapeTag: 'stone',
        currentlyWaterlogged: true,
        placingWaterBucket: true,
        placingBlockWithWaterPresent: true,
      }),
    ).toBe(false);
  });

  it('onRemove yields water', () => {
    expect(onRemove(true)).toBe('water');
    expect(onRemove(false)).toBe('air');
  });
});
