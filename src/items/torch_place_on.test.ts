import { describe, it, expect } from 'vitest';
import { canAttach, variantFor, redstoneTorchOutput, TORCH_EMISSION } from './torch_place_on';

describe('torch placement', () => {
  it('full top works', () => {
    expect(canAttach({ blockId: 'webmc:stone', face: 'top', faceIsFull: true })).toBe(true);
  });

  it('partial top rejected', () => {
    expect(canAttach({ blockId: 'webmc:stone_slab', face: 'top', faceIsFull: false })).toBe(false);
  });

  it('full side works', () => {
    expect(canAttach({ blockId: 'webmc:stone', face: 'north', faceIsFull: true })).toBe(true);
  });

  it('fence top override', () => {
    expect(canAttach({ blockId: 'webmc:oak_fence', face: 'top', faceIsFull: false })).toBe(true);
  });

  it('variant mapping', () => {
    expect(variantFor({ blockId: 'x', face: 'top', faceIsFull: true })).toBe('torch');
    expect(variantFor({ blockId: 'x', face: 'east', faceIsFull: true })).toBe('wall_torch');
  });

  it('torch emission 14', () => {
    expect(TORCH_EMISSION).toBe(14);
  });

  it('redstone torch inverter', () => {
    expect(redstoneTorchOutput(true)).toBe(0);
    expect(redstoneTorchOutput(false)).toBe(15);
  });
});
