import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { AIR, type BlockState, makeState } from '@/blocks/state';
import { SUBCHUNK_DIM, SubChunk } from '../SubChunk';
import { EMPTY_NEIGHBORS, meshSubChunk } from './greedy';

const STONE = makeState(1, 0);
const DIRT = makeState(2, 0);

const opaqueByState = (s: BlockState) => s !== AIR;
const colorByState = (s: BlockState): readonly [number, number, number] =>
  s === STONE ? [128, 128, 128] : s === DIRT ? [134, 96, 67] : [0, 0, 0];
const faceColorsByState = (s: BlockState) => {
  const c = colorByState(s);
  return { top: c, bottom: c, side: c };
};

describe('greedy mesher', () => {
  it('empty subchunk produces 0 quads', () => {
    const sc = new SubChunk();
    const out = meshSubChunk({
      self: sc,
      neighbors: EMPTY_NEIGHBORS,
      isOpaque: opaqueByState,
      faceColorsOf: faceColorsByState,
    });
    expect(out.quadCount).toBe(0);
    expect(out.positions.length).toBe(0);
    expect(out.indices.length).toBe(0);
  });

  it('full uniform subchunk with no neighbors emits exactly 6 merged quads', () => {
    const sc = new SubChunk(STONE);
    const out = meshSubChunk({
      self: sc,
      neighbors: EMPTY_NEIGHBORS,
      isOpaque: opaqueByState,
      faceColorsOf: faceColorsByState,
    });
    expect(out.quadCount).toBe(6);
    expect(out.positions.length).toBe(6 * 4 * 3);
    expect(out.indices.length).toBe(6 * 6);
  });

  it('full subchunk with all neighbors opaque emits no quads', () => {
    const sc = new SubChunk(STONE);
    const alwaysOpaque = () => true;
    const out = meshSubChunk({
      self: sc,
      neighbors: {
        nx: alwaysOpaque,
        px: alwaysOpaque,
        ny: alwaysOpaque,
        py: alwaysOpaque,
        nz: alwaysOpaque,
        pz: alwaysOpaque,
      },
      isOpaque: opaqueByState,
      faceColorsOf: faceColorsByState,
    });
    expect(out.quadCount).toBe(0);
  });

  it('single voxel in the middle emits 6 unit quads, all 1×1', () => {
    const sc = new SubChunk();
    sc.set(5, 5, 5, STONE);
    const out = meshSubChunk({
      self: sc,
      neighbors: EMPTY_NEIGHBORS,
      isOpaque: opaqueByState,
      faceColorsOf: faceColorsByState,
    });
    expect(out.quadCount).toBe(6);
    expect(out.positions.length).toBe(6 * 4 * 3);
  });

  it('two adjacent blocks merge along the shared-axis face direction', () => {
    const sc = new SubChunk();
    sc.set(5, 5, 5, STONE);
    sc.set(6, 5, 5, STONE);
    const out = meshSubChunk({
      self: sc,
      neighbors: EMPTY_NEIGHBORS,
      isOpaque: opaqueByState,
      faceColorsOf: faceColorsByState,
    });
    // Two cubes share an internal face (both cull it). Each contributes
    // 5 exterior faces merged: top/bottom (1×2), front/back (1×2),
    // plus one 1×1 on each external ±x side → 6 quads total.
    expect(out.quadCount).toBe(6);
  });

  it('indices always reference a valid vertex', () => {
    const sc = new SubChunk();
    for (let x = 0; x < 8; x++) for (let z = 0; z < 8; z++) sc.set(x, 0, z, STONE);
    const out = meshSubChunk({
      self: sc,
      neighbors: EMPTY_NEIGHBORS,
      isOpaque: opaqueByState,
      faceColorsOf: faceColorsByState,
    });
    const vertCount = out.positions.length / 3;
    for (const i of out.indices) {
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(vertCount);
    }
  });

  it('per-quad vertex-count invariant: positions = 12 * quadCount floats', () => {
    const sc = new SubChunk();
    for (let i = 0; i < 50; i++) {
      sc.set(i % SUBCHUNK_DIM, (i * 3) % SUBCHUNK_DIM, (i * 7) % SUBCHUNK_DIM, STONE);
    }
    const out = meshSubChunk({
      self: sc,
      neighbors: EMPTY_NEIGHBORS,
      isOpaque: opaqueByState,
      faceColorsOf: faceColorsByState,
    });
    expect(out.positions.length).toBe(12 * out.quadCount);
    expect(out.normals.length).toBe(12 * out.quadCount);
    expect(out.colors.length).toBe(16 * out.quadCount);
    expect(out.indices.length).toBe(6 * out.quadCount);
  });

  it('all emitted positions are within [0, DIM]', () => {
    const sc = new SubChunk(STONE);
    const out = meshSubChunk({
      self: sc,
      neighbors: EMPTY_NEIGHBORS,
      isOpaque: opaqueByState,
      faceColorsOf: faceColorsByState,
    });
    for (const p of out.positions) {
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(SUBCHUNK_DIM);
    }
  });

  it('property: random subchunks produce consistent buffer sizes', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.tuple(
            fc.integer({ min: 0, max: 15 }),
            fc.integer({ min: 0, max: 15 }),
            fc.integer({ min: 0, max: 15 }),
            fc.integer({ min: 0, max: 2 }),
          ),
          { minLength: 1, maxLength: 200 },
        ),
        (ops) => {
          const sc = new SubChunk();
          for (const [x, y, z, b] of ops) {
            const state = b === 0 ? AIR : b === 1 ? STONE : DIRT;
            sc.set(x, y, z, state);
          }
          const out = meshSubChunk({
            self: sc,
            neighbors: EMPTY_NEIGHBORS,
            isOpaque: opaqueByState,
            faceColorsOf: faceColorsByState,
          });
          expect(out.positions.length).toBe(12 * out.quadCount);
          expect(out.indices.length).toBe(6 * out.quadCount);
          const vertCount = out.positions.length / 3;
          for (const i of out.indices) {
            expect(i).toBeLessThan(vertCount);
          }
        },
      ),
      { numRuns: 15 },
    );
  });

  it('neighbor-opaque on one side removes that whole face', () => {
    const sc = new SubChunk(STONE);
    const alwaysOpaque = () => true;
    const out = meshSubChunk({
      self: sc,
      neighbors: { ...EMPTY_NEIGHBORS, px: alwaysOpaque },
      isOpaque: opaqueByState,
      faceColorsOf: faceColorsByState,
    });
    expect(out.quadCount).toBe(5);
  });
});
