import { describe, it, expect } from 'vitest';
import { sortByRecent, totalStorage, filter } from './saves_list_metadata';

const list = [
  { name: 'w1', lastPlayed: 1000, size: 500, gameMode: 'survival' as const, version: 1 },
  { name: 'w2', lastPlayed: 5000, size: 800, gameMode: 'creative' as const, version: 1 },
  { name: 'hardcore_run', lastPlayed: 100, size: 200, gameMode: 'survival' as const, version: 1 },
];

describe('saves list metadata', () => {
  it('sort newest first', () => {
    expect(sortByRecent(list)[0]?.name).toBe('w2');
  });

  it('sum sizes', () => {
    expect(totalStorage(list)).toBe(1500);
  });

  it('filter by substring', () => {
    expect(filter(list, 'hardcore')).toHaveLength(1);
  });
});
