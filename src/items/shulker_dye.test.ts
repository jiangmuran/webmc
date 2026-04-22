import { describe, it, expect } from 'vitest';
import { dyeShulker, isAnyShulker, parseShulkerId, shulkerBlockId } from './shulker_dye';

describe('shulker dye', () => {
  it('default shulker id', () => {
    expect(shulkerBlockId('default')).toBe('webmc:shulker_box');
  });

  it('red shulker id', () => {
    expect(shulkerBlockId('red')).toBe('webmc:red_shulker_box');
  });

  it('parse id', () => {
    expect(parseShulkerId('webmc:shulker_box')).toBe('default');
    expect(parseShulkerId('webmc:blue_shulker_box')).toBe('blue');
    expect(parseShulkerId('webmc:xyz_shulker_box')).toBeNull();
  });

  it('dye changes color', () => {
    const r = dyeShulker({ shulkerColor: 'default', dye: 'red' });
    expect(r.changed).toBe(true);
    expect(r.newId).toBe('webmc:red_shulker_box');
  });

  it('same-color dye = no change', () => {
    expect(dyeShulker({ shulkerColor: 'red', dye: 'red' }).changed).toBe(false);
  });

  it('isAnyShulker', () => {
    expect(isAnyShulker('webmc:shulker_box')).toBe(true);
    expect(isAnyShulker('webmc:chest')).toBe(false);
  });
});
