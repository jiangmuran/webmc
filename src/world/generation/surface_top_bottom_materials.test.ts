import { describe, it, expect } from 'vitest';
import { surfaceTopBlock, surfaceUnderBlock, needsBedrock } from './surface_top_bottom_materials';

describe('surface top/bottom materials', () => {
  it('plains → grass', () => {
    expect(surfaceTopBlock('plains')).toBe('grass_block');
  });

  it('desert → sand', () => {
    expect(surfaceTopBlock('desert')).toBe('sand');
  });

  it('mushroom fields → mycelium', () => {
    expect(surfaceTopBlock('mushroom_fields')).toBe('mycelium');
  });

  it('desert under → sandstone', () => {
    expect(surfaceUnderBlock('desert')).toBe('sandstone');
  });

  it('plains under → dirt', () => {
    expect(surfaceUnderBlock('plains')).toBe('dirt');
  });

  it('bedrock near bottom', () => {
    expect(needsBedrock(-63, -64)).toBe(true);
    expect(needsBedrock(-50, -64)).toBe(false);
  });
});
