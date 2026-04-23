import { describe, it, expect } from 'vitest';
import { findConnected, breakCascade, type Pos } from './chorus_plant_break_cascade';

const blocks = new Set<Pos>(['0,0,0', '0,1,0', '0,2,0', '1,2,0']);

const neigh = (p: Pos): Pos[] => {
  const [x, y, z] = p.split(',').map(Number) as [number, number, number];
  return [
    `${x + 1},${y},${z}`,
    `${x - 1},${y},${z}`,
    `${x},${y + 1},${z}`,
    `${x},${y - 1},${z}`,
    `${x},${y},${z + 1}`,
    `${x},${y},${z - 1}`,
  ];
};

describe('chorus plant break cascade', () => {
  it('finds all connected', () => {
    const c = findConnected('0,0,0', neigh, (p) => blocks.has(p));
    expect(new Set(c)).toEqual(blocks);
  });

  it('empty if origin not chorus', () => {
    expect(findConnected('99,99,99', neigh, (p) => blocks.has(p))).toEqual([]);
  });

  it('cascade drops unsupported', () => {
    const drops = breakCascade(
      '0,0,0',
      neigh,
      (p) => blocks.has(p),
      (p) => p === '0,0,0',
    );
    expect(drops.length).toBe(3);
  });

  it('all supported drops none', () => {
    expect(
      breakCascade(
        '0,0,0',
        neigh,
        (p) => blocks.has(p),
        () => true,
      ),
    ).toEqual([]);
  });
});
