import { describe, it, expect } from 'vitest';
import { renderRow, sortByScoreDescending, Tablist, type TablistEntry } from './tablist';

function mk(name: string, score = 0, listed = true): TablistEntry {
  return {
    uuid: `u-${name}`,
    name,
    gamemode: 'survival',
    signal: { bars: 5, color: 'lime', label: 'excellent' },
    teamPrefix: '',
    teamSuffix: '',
    objectiveScore: score,
    listed,
  };
}

describe('tablist', () => {
  it('upsert + list alphabetical', () => {
    const t = new Tablist();
    t.upsert(mk('bob'));
    t.upsert(mk('alice'));
    const names = t.listedEntries().map((e) => e.name);
    expect(names).toEqual(['alice', 'bob']);
  });

  it('hidden entries excluded', () => {
    const t = new Tablist();
    t.upsert(mk('bob'));
    t.upsert(mk('ghost', 0, false));
    expect(t.listedEntries().length).toBe(1);
  });

  it('header/footer', () => {
    const t = new Tablist();
    t.setHeaderFooter('§cHello', '§7Footer');
    expect(t.getHeader()).toBe('§cHello');
    expect(t.getFooter()).toBe('§7Footer');
  });

  it('remove', () => {
    const t = new Tablist();
    t.upsert(mk('alice'));
    t.remove('u-alice');
    expect(t.size()).toBe(0);
  });

  it('sortByScoreDescending', () => {
    const entries = [mk('alice', 5), mk('bob', 10), mk('charlie', 0)];
    const sorted = sortByScoreDescending(entries);
    expect(sorted.map((e) => e.name)).toEqual(['bob', 'alice', 'charlie']);
  });

  it('renderRow includes score and prefix', () => {
    const entry = mk('alice', 42);
    entry.teamPrefix = '§c[RED]§r ';
    expect(renderRow(entry)).toContain('[RED]');
    expect(renderRow(entry)).toContain('[42]');
  });
});
