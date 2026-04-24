import { describe, it, expect } from 'vitest';
import { detailFor, shouldAnimate } from './entity_lod_distance';

describe('entity LOD distance', () => {
  it('close full model', () => {
    expect(detailFor({ distance: 5, entityType: 'hostile' })).toBe('full_model');
  });

  it('mid low poly', () => {
    expect(detailFor({ distance: 50, entityType: 'hostile' })).toBe('low_poly');
  });

  it('far billboard', () => {
    expect(detailFor({ distance: 100, entityType: 'hostile' })).toBe('billboard');
  });

  it('very far culled', () => {
    expect(detailFor({ distance: 500, entityType: 'hostile' })).toBe('culled');
  });

  it('players render farther', () => {
    expect(detailFor({ distance: 60, entityType: 'player' })).toBe('full_model');
  });

  it('billboards skip animation', () => {
    expect(shouldAnimate('billboard')).toBe(false);
    expect(shouldAnimate('full_model')).toBe(true);
  });
});
