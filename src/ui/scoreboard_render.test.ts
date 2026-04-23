import { describe, it, expect } from 'vitest';
import { sortedRows, topRows, displayName, MAX_DISPLAYED } from './scoreboard_render';

describe('scoreboard render', () => {
  it('sort desc by score', () => {
    const r = sortedRows([
      { name: 'b', score: 5 },
      { name: 'a', score: 10 },
    ]);
    expect(r[0]?.name).toBe('a');
  });

  it('tie breaks by name', () => {
    const r = sortedRows([
      { name: 'b', score: 5 },
      { name: 'a', score: 5 },
    ]);
    expect(r[0]?.name).toBe('a');
  });

  it('top caps to 15', () => {
    const all = Array.from({ length: 30 }, (_, i) => ({ name: `p${i}`, score: 100 - i }));
    expect(topRows(all)).toHaveLength(MAX_DISPLAYED);
  });

  it('formats display', () => {
    expect(displayName({ name: 'x', score: 7 })).toBe('x: 7');
  });
});
