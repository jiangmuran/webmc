import { describe, it, expect } from 'vitest';
import { canSave, canLoad, isCornerMarker } from './structure_block_modes';

const base = { posX: 0, posY: 0, posZ: 0 };

describe('structure block modes', () => {
  it('save valid with size', () => {
    expect(canSave({ ...base, mode: 'save', name: 'x', sizeX: 1, sizeY: 1, sizeZ: 1 })).toBe(true);
  });

  it('save 0-size fails', () => {
    expect(canSave({ ...base, mode: 'save', name: 'x', sizeX: 0, sizeY: 1, sizeZ: 1 })).toBe(false);
  });

  it('load needs name', () => {
    expect(canLoad({ ...base, mode: 'load', name: '', sizeX: 1, sizeY: 1, sizeZ: 1 })).toBe(false);
    expect(canLoad({ ...base, mode: 'load', name: 'lib:door', sizeX: 1, sizeY: 1, sizeZ: 1 })).toBe(
      true,
    );
  });

  it('corner flag', () => {
    expect(
      isCornerMarker({ ...base, mode: 'corner', name: 'x', sizeX: 1, sizeY: 1, sizeZ: 1 }),
    ).toBe(true);
  });
});
