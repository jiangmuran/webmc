import { describe, it, expect } from 'vitest';
import { fill, consumesCauldronLevel, GLASS_BOTTLE_MAX_STACK } from './glass_bottle_fill';

describe('glass bottle fill', () => {
  it('water source', () => {
    expect(fill({ kind: 'water_source' })).toBe('water_bottle');
  });

  it('cauldron', () => {
    expect(fill({ kind: 'cauldron_water', level: 2 })).toBe('water_bottle');
  });

  it('bee nest full', () => {
    expect(fill({ kind: 'bee_nest_full' })).toBe('honey_bottle');
  });

  it('dragon breath cloud', () => {
    expect(fill({ kind: 'dragon_breath_cloud' })).toBe('dragon_breath');
  });

  it('other nothing', () => {
    expect(fill({ kind: 'other' })).toBe('none');
  });

  it('cauldron consumes 1', () => {
    expect(consumesCauldronLevel({ kind: 'cauldron_water', level: 3 })).toBe(1);
    expect(consumesCauldronLevel({ kind: 'water_source' })).toBe(0);
  });

  it('max stack', () => {
    expect(GLASS_BOTTLE_MAX_STACK).toBe(64);
  });
});
