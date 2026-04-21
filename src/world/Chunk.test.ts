import { describe, it, expect } from 'vitest';
import { AIR, makeState } from '@/blocks/state';
import { CHUNK_DIM, CHUNK_HEIGHT, CHUNK_SECTIONS, Chunk, localYOf, sectionOf } from './Chunk';

const STONE = makeState(1, 0);
const DIRT = makeState(2, 0);

describe('Chunk', () => {
  it('is all air when fresh, no sections allocated', () => {
    const c = new Chunk(0, 0);
    expect(c.sections.every((s) => s === null)).toBe(true);
    expect(c.get(0, 0, 0)).toBe(AIR);
    expect(c.get(15, 383, 15)).toBe(AIR);
    expect(c.version).toBe(0);
    expect(c.meshDirty.size).toBe(0);
  });

  it('setting a non-air block lazily allocates the containing section', () => {
    const c = new Chunk(0, 0);
    c.set(5, 70, 9, STONE);
    expect(c.section(sectionOf(70))).not.toBeNull();
    expect(c.section(0)).toBeNull();
    expect(c.get(5, 70, 9)).toBe(STONE);
    expect(c.meshDirty.has(sectionOf(70))).toBe(true);
    expect(c.version).toBe(1);
  });

  it('setting air in an empty section is a no-op (no allocation, no dirty)', () => {
    const c = new Chunk(0, 0);
    c.set(5, 70, 9, AIR);
    expect(c.section(sectionOf(70))).toBeNull();
    expect(c.meshDirty.size).toBe(0);
    expect(c.version).toBe(0);
  });

  it('boundary mutation marks adjacent subchunk dirty', () => {
    const c = new Chunk(0, 0);
    c.set(0, 31, 0, STONE);
    const cy = sectionOf(31);
    expect(localYOf(31)).toBe(15);
    expect(c.meshDirty.has(cy)).toBe(true);
    expect(c.meshDirty.has(cy + 1)).toBe(true);
    c.set(0, 16, 0, DIRT);
    expect(c.meshDirty.has(sectionOf(16))).toBe(true);
    expect(c.meshDirty.has(sectionOf(16) - 1)).toBe(true);
  });

  it('rejects out-of-range coords', () => {
    const c = new Chunk(0, 0);
    expect(() => c.get(16, 0, 0)).toThrow(RangeError);
    expect(() => c.get(0, CHUNK_HEIGHT, 0)).toThrow(RangeError);
    expect(() => {
      c.set(-1, 0, 0, STONE);
    }).toThrow(RangeError);
  });

  it('ensureSection creates exactly once', () => {
    const c = new Chunk(0, 0);
    const a = c.ensureSection(5);
    const b = c.ensureSection(5);
    expect(a).toBe(b);
  });

  it('sectionOf/localYOf are inverses over the full column', () => {
    for (let y = 0; y < CHUNK_HEIGHT; y++) {
      const cy = sectionOf(y);
      const ly = localYOf(y);
      expect(cy * 16 + ly).toBe(y);
      expect(cy).toBeGreaterThanOrEqual(0);
      expect(cy).toBeLessThan(CHUNK_SECTIONS);
    }
  });

  it('clearMeshDirty respects optional cy', () => {
    const c = new Chunk(0, 0);
    c.set(0, 32, 0, STONE);
    c.set(0, 80, 0, DIRT);
    expect(c.meshDirty.size).toBeGreaterThanOrEqual(2);
    c.clearMeshDirty(sectionOf(32));
    expect(c.meshDirty.has(sectionOf(32))).toBe(false);
    c.clearMeshDirty();
    expect(c.meshDirty.size).toBe(0);
  });

  it('CHUNK_DIM constants are the expected MC-equivalent values', () => {
    expect(CHUNK_DIM).toBe(16);
    expect(CHUNK_SECTIONS).toBe(24);
    expect(CHUNK_HEIGHT).toBe(384);
  });
});
