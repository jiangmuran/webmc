import { describe, it, expect } from 'vitest';
import { blockAtY } from './deepslate_shale_transition';

describe('deepslate shale transition', () => {
  it('below is deepslate', () => {
    expect(blockAtY(-20, 0.5)).toBe('deepslate');
  });

  it('above is stone', () => {
    expect(blockAtY(100, 0.5)).toBe('stone');
  });

  it('mid noise stochastic', () => {
    // At y=4, threshold is 0.5; noise<threshold → stone, noise>threshold → deepslate
    expect(blockAtY(4, 0.1)).toBe('stone');
    expect(blockAtY(4, 0.9)).toBe('deepslate');
  });
});
