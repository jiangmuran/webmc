import { describe, it, expect } from 'vitest';
import { axisFromClick, isWaterlogged } from './chain_block_orientation';

describe('chain block orientation', () => {
  it('up -> y axis', () => {
    expect(axisFromClick({ clickedFace: 'up', waterlogged: false })).toBe('y');
  });

  it('north -> z axis', () => {
    expect(axisFromClick({ clickedFace: 'north', waterlogged: false })).toBe('z');
  });

  it('east -> x axis', () => {
    expect(axisFromClick({ clickedFace: 'east', waterlogged: false })).toBe('x');
  });

  it('waterlogged flag', () => {
    expect(isWaterlogged({ clickedFace: 'up', waterlogged: true })).toBe(true);
  });
});
