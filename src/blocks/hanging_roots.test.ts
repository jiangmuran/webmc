import { describe, it, expect } from 'vitest';
import {
  canStay,
  harvestDrops,
  waterloggable,
  placeableByBonemealOnRootedDirt,
} from './hanging_roots';

describe('hanging roots', () => {
  it('stays under rooted dirt', () => {
    expect(canStay({ attachedTo: 'rooted_dirt', supportExists: true })).toBe(true);
  });

  it('stays under azalea', () => {
    expect(canStay({ attachedTo: 'azalea', supportExists: true })).toBe(true);
  });

  it('other support rejected', () => {
    expect(canStay({ attachedTo: 'other', supportExists: true })).toBe(false);
  });

  it('no support falls', () => {
    expect(canStay({ attachedTo: 'rooted_dirt', supportExists: false })).toBe(false);
  });

  it('shears drop', () => {
    expect(harvestDrops(true)).toContain('hanging_roots');
  });

  it('no shears no drop', () => {
    expect(harvestDrops(false).length).toBe(0);
  });

  it('waterloggable', () => {
    expect(waterloggable()).toBe(true);
  });

  it('bonemeal places', () => {
    expect(placeableByBonemealOnRootedDirt()).toBe(true);
  });
});
