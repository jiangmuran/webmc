import { describe, it, expect } from 'vitest';
import { conflicts } from './keybind_conflict';

describe('keybind conflict', () => {
  it('no conflict with unique keys', () => {
    expect(
      conflicts([
        { action: 'jump', key: 'Space' },
        { action: 'attack', key: 'Mouse0' },
      ]),
    ).toEqual([]);
  });

  it('reports shared key', () => {
    const c = conflicts([
      { action: 'jump', key: 'Space' },
      { action: 'use', key: 'Space' },
    ]);
    expect(c).toHaveLength(1);
    expect(c[0]).toEqual(['jump', 'use']);
  });

  it('triple conflict yields 3 pairs', () => {
    const c = conflicts([
      { action: 'a', key: 'E' },
      { action: 'b', key: 'E' },
      { action: 'c', key: 'E' },
    ]);
    expect(c).toHaveLength(3);
  });
});
