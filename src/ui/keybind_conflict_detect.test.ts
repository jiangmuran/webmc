import { describe, it, expect } from 'vitest';
import { conflicts } from './keybind_conflict_detect';

describe('keybind conflict detect', () => {
  it('no conflict when modifiers differ', () => {
    expect(
      conflicts([
        { action: 'copy', key: 'C', modifier: 'ctrl' },
        { action: 'delete', key: 'C' },
      ]),
    ).toEqual([]);
  });

  it('conflict on same key+mod', () => {
    const c = conflicts([
      { action: 'copy', key: 'C', modifier: 'ctrl' },
      { action: 'clone', key: 'C', modifier: 'ctrl' },
    ]);
    expect(c).toHaveLength(1);
  });

  it('triple conflict yields 3 pairs', () => {
    expect(
      conflicts([
        { action: 'a', key: 'X' },
        { action: 'b', key: 'X' },
        { action: 'c', key: 'X' },
      ]),
    ).toHaveLength(3);
  });
});
