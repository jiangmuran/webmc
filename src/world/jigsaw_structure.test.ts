import { describe, it, expect } from 'vitest';
import {
  makeAssembly,
  canExtend,
  openConnectors,
  weightedPick,
  type Piece,
} from './jigsaw_structure';

const root: Piece = {
  id: 'root',
  bounds: { w: 5, h: 5, d: 5 },
  connectors: [
    { pool: 'street', facing: 'east', attachedTo: null },
    { pool: 'street', facing: 'west', attachedTo: 'other' },
  ],
};

describe('jigsaw structure', () => {
  it('assembly root only', () => {
    expect(makeAssembly(root).placed.length).toBe(1);
  });

  it('canExtend while under depth', () => {
    expect(canExtend(makeAssembly(root, 3))).toBe(true);
  });

  it('canExtend false at depth', () => {
    expect(canExtend({ placed: [root], depth: 5, maxDepth: 5 })).toBe(false);
  });

  it('open connectors', () => {
    const c = openConnectors(makeAssembly(root));
    expect(c.length).toBe(1);
    expect(c[0]?.facing).toBe('east');
  });

  it('weighted pick low roll first', () => {
    const r = weightedPick(
      [
        { pieceId: 'a', weight: 1 },
        { pieceId: 'b', weight: 99 },
      ],
      () => 0,
    );
    expect(r?.pieceId).toBe('a');
  });

  it('weighted pick high roll last', () => {
    const r = weightedPick(
      [
        { pieceId: 'a', weight: 1 },
        { pieceId: 'b', weight: 99 },
      ],
      () => 0.99,
    );
    expect(r?.pieceId).toBe('b');
  });
});
