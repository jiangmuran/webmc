import { describe, it, expect } from 'vitest';
import { matches } from './crafting_shaped';

const sword = {
  pattern: ['X', 'X', 'S'],
  key: { X: 'iron_ingot', S: 'stick' },
  result: { id: 'iron_sword', count: 1 },
};

function grid3x3(rows: (string | null)[][]): (string | null)[][] {
  const r: (string | null)[][] = [];
  for (let i = 0; i < 3; i++) {
    r.push([rows[i]?.[0] ?? null, rows[i]?.[1] ?? null, rows[i]?.[2] ?? null]);
  }
  return r;
}

describe('crafting shaped', () => {
  it('sword in left column', () => {
    const g = grid3x3([
      ['iron_ingot', null, null],
      ['iron_ingot', null, null],
      ['stick', null, null],
    ]);
    expect(matches(sword, g)).toBe(true);
  });

  it('sword in middle column', () => {
    const g = grid3x3([
      [null, 'iron_ingot', null],
      [null, 'iron_ingot', null],
      [null, 'stick', null],
    ]);
    expect(matches(sword, g)).toBe(true);
  });

  it('extra item invalidates', () => {
    const g = grid3x3([
      ['iron_ingot', 'dirt', null],
      ['iron_ingot', null, null],
      ['stick', null, null],
    ]);
    expect(matches(sword, g)).toBe(false);
  });

  it('wrong material', () => {
    const g = grid3x3([
      ['gold_ingot', null, null],
      ['gold_ingot', null, null],
      ['stick', null, null],
    ]);
    expect(matches(sword, g)).toBe(false);
  });
});
