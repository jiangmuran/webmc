import { describe, it, expect } from 'vitest';
import { sortByMaterial, materialChangeCount } from './batch_draw_call';

const m = (material: string, meshId: string) => ({
  material,
  meshId,
  transform: new Float32Array(16),
});

describe('batch draw call', () => {
  it('sort groups materials', () => {
    const sorted = sortByMaterial([m('b', '1'), m('a', '2'), m('b', '3')]);
    expect(sorted[0]?.material).toBe('a');
  });

  it('empty is zero changes', () => {
    expect(materialChangeCount([])).toBe(0);
  });

  it('counts material switches', () => {
    const sorted = sortByMaterial([m('b', '1'), m('a', '2'), m('b', '3')]);
    expect(materialChangeCount(sorted)).toBe(1);
  });
});
