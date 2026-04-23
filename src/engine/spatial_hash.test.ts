import { describe, it, expect } from 'vitest';
import { makeGrid, insert, queryBox, clear, totalCells } from './spatial_hash';

describe('spatial hash', () => {
  it('insert + query hit', () => {
    const g = makeGrid<string>(16);
    insert(g, 'a', 5, 5, 5);
    insert(g, 'b', 20, 5, 5);
    expect(queryBox(g, 0, 0, 0, 10, 10, 10)).toEqual(['a']);
  });

  it('query spans cells', () => {
    const g = makeGrid<string>(16);
    insert(g, 'a', 5, 5, 5);
    insert(g, 'b', 20, 5, 5);
    const r = queryBox(g, 0, 0, 0, 30, 10, 10);
    expect(r.sort()).toEqual(['a', 'b']);
  });

  it('no dup when same ref spans cells', () => {
    const g = makeGrid<{ id: string }>(16);
    const obj = { id: 'a' };
    insert(g, obj, 5, 5, 5);
    insert(g, obj, 20, 5, 5);
    const r = queryBox(g, 0, 0, 0, 30, 10, 10);
    expect(r.length).toBe(1);
  });

  it('clear empties', () => {
    const g = makeGrid<string>(16);
    insert(g, 'a', 0, 0, 0);
    clear(g);
    expect(totalCells(g)).toBe(0);
  });
});
