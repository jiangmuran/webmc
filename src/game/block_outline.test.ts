import { describe, it, expect } from 'vitest';
import {
  fullCubeShape,
  outlineColor,
  slabShape,
  stairsShape,
  wireframeLinesFor,
} from './block_outline';

describe('block outline', () => {
  it('full cube = 12 edges', () => {
    expect(wireframeLinesFor(fullCubeShape()).length).toBe(12);
  });

  it('stairs = 24 edges (2 boxes)', () => {
    expect(wireframeLinesFor(stairsShape()).length).toBe(24);
  });

  it('bottom slab box has maxY=0.5', () => {
    const s = slabShape(false);
    expect(s.boxes[0]?.maxY).toBe(0.5);
  });

  it('top slab box has minY=0.5', () => {
    const s = slabShape(true);
    expect(s.boxes[0]?.minY).toBe(0.5);
  });

  it('outline black when dry', () => {
    expect(outlineColor(false).r).toBe(0);
  });

  it('outline white in water', () => {
    expect(outlineColor(true).r).toBe(255);
  });
});
