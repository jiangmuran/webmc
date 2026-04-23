import { describe, it, expect } from 'vitest';
import { canConvert, convertedBlock, tramplingPreventedByFarmland } from './dirt_path_convert';

describe('dirt path convert', () => {
  it('grass converts', () => {
    expect(canConvert({ target: 'grass_block', topBlockIsAir: true })).toBe(true);
  });

  it('stone cannot', () => {
    expect(canConvert({ target: 'stone', topBlockIsAir: true })).toBe(false);
  });

  it('air above required', () => {
    expect(canConvert({ target: 'grass_block', topBlockIsAir: false })).toBe(false);
  });

  it('converts to dirt_path', () => {
    expect(convertedBlock()).toBe('dirt_path');
  });

  it('farmland no effect', () => {
    expect(tramplingPreventedByFarmland()).toBe(false);
  });
});
