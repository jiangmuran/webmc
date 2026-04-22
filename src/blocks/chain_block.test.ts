import { describe, it, expect } from 'vitest';
import {
  canSupportHangingLantern,
  chainDrops,
  craftChain,
  placeChain,
  rotateAxis,
} from './chain_block';

describe('chain block', () => {
  it('top placement = y axis', () => {
    expect(placeChain('top').axis).toBe('y');
  });

  it('side placement = x or z', () => {
    expect(placeChain('side_x').axis).toBe('x');
    expect(placeChain('side_z').axis).toBe('z');
  });

  it('rotate swaps x/z, leaves y', () => {
    expect(rotateAxis('x')).toBe('z');
    expect(rotateAxis('z')).toBe('x');
    expect(rotateAxis('y')).toBe('y');
  });

  it('only y-axis supports hanging lanterns', () => {
    expect(canSupportHangingLantern({ axis: 'y', waterlogged: false })).toBe(true);
    expect(canSupportHangingLantern({ axis: 'x', waterlogged: false })).toBe(false);
  });

  it('drops itself', () => {
    expect(chainDrops()[0]?.item).toBe('webmc:chain');
  });

  it('crafts with 2 nuggets + 1 ingot', () => {
    expect(craftChain({ ironNuggets: 2, ironIngots: 1 })).not.toBeNull();
    expect(craftChain({ ironNuggets: 1, ironIngots: 1 })).toBeNull();
    expect(craftChain({ ironNuggets: 2, ironIngots: 0 })).toBeNull();
  });
});
