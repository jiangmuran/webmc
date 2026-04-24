import { describe, it, expect } from 'vitest';
import {
  displayedEntries,
  formatLine,
  widestName,
  MAX_SIDEBAR_ENTRIES,
  type ScoreLine,
} from './scoreboard_sidebar_render';

const scores: ScoreLine[] = [
  { name: 'alice', score: 10 },
  { name: 'bob', score: 5 },
  { name: 'carol', score: 50 },
];

describe('scoreboard sidebar render', () => {
  it('sorts desc by score', () => {
    expect(displayedEntries(scores)[0]?.name).toBe('carol');
  });

  it('caps entries', () => {
    const big = Array.from({ length: 20 }, (_, i) => ({ name: `p${i}`, score: i }));
    expect(displayedEntries(big).length).toBe(MAX_SIDEBAR_ENTRIES);
  });

  it('format pads name', () => {
    expect(formatLine(scores[0] ?? { name: '', score: 0 }, 10, 4)).toContain('alice');
  });

  it('widest name tracks length', () => {
    expect(widestName(scores)).toBe(5);
  });

  it('empty width 0', () => {
    expect(widestName([])).toBe(0);
  });
});
