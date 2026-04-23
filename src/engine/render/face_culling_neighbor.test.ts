import { describe, it, expect } from 'vitest';
import { shouldCullFace, facesToRender, type Face } from './face_culling_neighbor';

const transparent = new Set(['glass', 'water', 'leaves']);

describe('face culling neighbor', () => {
  it('air face not culled', () => {
    expect(shouldCullFace('stone', 'air', transparent)).toBe(false);
  });

  it('stone next to stone culled', () => {
    expect(shouldCullFace('stone', 'stone', transparent)).toBe(true);
  });

  it('stone next to glass rendered', () => {
    expect(shouldCullFace('stone', 'glass', transparent)).toBe(false);
  });

  it('glass next to glass culled', () => {
    expect(shouldCullFace('glass', 'glass', transparent)).toBe(true);
  });

  it('render all 6 when isolated', () => {
    const n: Record<Face, string> = {
      px: 'air',
      nx: 'air',
      py: 'air',
      ny: 'air',
      pz: 'air',
      nz: 'air',
    };
    expect(facesToRender('stone', n, transparent)).toHaveLength(6);
  });

  it('render only exposed faces', () => {
    const n: Record<Face, string> = {
      px: 'stone',
      nx: 'air',
      py: 'stone',
      ny: 'stone',
      pz: 'stone',
      nz: 'stone',
    };
    expect(facesToRender('stone', n, transparent)).toEqual(['nx']);
  });
});
