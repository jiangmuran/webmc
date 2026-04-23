import { describe, it, expect } from 'vitest';
import { validNyliumFor, canGrowHugeFungus, hugeFungusHeight } from './warped_crimson_fungus';

describe('warped crimson fungus', () => {
  it('warped wants warped_nylium', () => {
    expect(validNyliumFor('warped')).toBe('warped_nylium');
  });

  it('crimson wants crimson_nylium', () => {
    expect(validNyliumFor('crimson')).toBe('crimson_nylium');
  });

  it('needs bonemeal and nylium', () => {
    expect(canGrowHugeFungus({ type: 'warped', onNylium: true, bonemealUsed: true })).toBe(true);
    expect(canGrowHugeFungus({ type: 'warped', onNylium: false, bonemealUsed: true })).toBe(false);
  });

  it('height 4-12 when grown', () => {
    const h = hugeFungusHeight({ type: 'crimson', onNylium: true, bonemealUsed: true }, () => 0.5);
    expect(h).toBeGreaterThanOrEqual(4);
    expect(h).toBeLessThanOrEqual(12);
  });

  it('no grow = 0 height', () => {
    expect(
      hugeFungusHeight({ type: 'crimson', onNylium: false, bonemealUsed: true }, () => 0.5),
    ).toBe(0);
  });
});
