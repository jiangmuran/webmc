import { describe, it, expect } from 'vitest';
import { pingBars, sortEntries, renderLine } from './tab_list_render';

describe('tab list', () => {
  it('ping bars', () => {
    expect(pingBars(30)).toBe(5);
    expect(pingBars(300)).toBe(2);
    expect(pingBars(1000)).toBe(1);
  });

  it('admin sorts first', () => {
    const sorted = sortEntries([
      { name: 'b', pingMs: 0, displayNamePrefix: '', isAdmin: false },
      { name: 'a', pingMs: 0, displayNamePrefix: '', isAdmin: false },
      { name: 'c', pingMs: 0, displayNamePrefix: '', isAdmin: true },
    ]);
    expect(sorted[0]?.name).toBe('c');
  });

  it('alphabetic within groups', () => {
    const sorted = sortEntries([
      { name: 'b', pingMs: 0, displayNamePrefix: '', isAdmin: false },
      { name: 'a', pingMs: 0, displayNamePrefix: '', isAdmin: false },
    ]);
    expect(sorted.map((e) => e.name)).toEqual(['a', 'b']);
  });

  it('render line', () => {
    const l = renderLine({ name: 'Steve', pingMs: 50, displayNamePrefix: '[red] ', isAdmin: true });
    expect(l).toContain('★');
    expect(l).toContain('Steve');
  });
});
