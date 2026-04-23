import { describe, it, expect } from 'vitest';
import { newManifest, diff } from './asset_pack_manifest';

describe('asset pack manifest', () => {
  it('empty manifest', () => {
    const m = newManifest('core');
    expect(m.blocks).toEqual([]);
  });

  it('diff added', () => {
    const prev = { ...newManifest('c'), blocks: ['stone'] };
    const next = { ...newManifest('c'), blocks: ['stone', 'dirt'] };
    expect(diff(prev, next)).toEqual({ added: ['dirt'], removed: [] });
  });

  it('diff removed', () => {
    const prev = { ...newManifest('c'), blocks: ['a', 'b'] };
    const next = { ...newManifest('c'), blocks: ['a'] };
    expect(diff(prev, next)).toEqual({ added: [], removed: ['b'] });
  });

  it('diff across blocks+items', () => {
    const prev = { ...newManifest('c'), blocks: ['a'], items: ['x'] };
    const next = { ...newManifest('c'), blocks: [], items: ['x', 'y'] };
    const d = diff(prev, next);
    expect(d.added).toEqual(['y']);
    expect(d.removed).toEqual(['a']);
  });
});
