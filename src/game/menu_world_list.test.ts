import { describe, it, expect } from 'vitest';
import { freshWorld } from '@/persist/world_metadata';
import {
  deleteWorld,
  makeWorldListState,
  requiresConfirmation,
  setSort,
  sortedWorlds,
  type WorldEntry,
} from './menu_world_list';

function entry(id: string, name: string, lastPlayed: number, locked = false): WorldEntry {
  return {
    id,
    metadata: { ...freshWorld(name, '0', 0), lastPlayedAt: lastPlayed },
    sizeBytes: 1000,
    screenshot: null,
    locked,
  };
}

describe('world list', () => {
  it('sort by last_played desc (default)', () => {
    const s = makeWorldListState();
    s.worlds = [entry('a', 'a', 10), entry('b', 'b', 20)];
    expect(sortedWorlds(s)[0]?.id).toBe('b');
  });

  it('sort toggles direction', () => {
    const s = makeWorldListState();
    setSort(s, 'last_played');
    expect(s.direction).toBe('asc');
  });

  it('name sort', () => {
    const s = makeWorldListState();
    s.worlds = [entry('a', 'Zeta', 0), entry('b', 'Alpha', 0)];
    setSort(s, 'name', 'asc');
    expect(sortedWorlds(s)[0]?.metadata.name).toBe('Alpha');
  });

  it('search filters', () => {
    const s = makeWorldListState();
    s.worlds = [entry('a', 'Alpha', 0), entry('b', 'Beta', 0)];
    s.searchQuery = 'alp';
    const list = sortedWorlds(s);
    expect(list.length).toBe(1);
  });

  it('cannot delete locked world', () => {
    const s = makeWorldListState();
    s.worlds = [entry('a', 'x', 0, true)];
    const r = deleteWorld(s, 'a');
    expect(r.deleted).toBe(false);
    expect(r.wasLocked).toBe(true);
  });

  it('delete removes world', () => {
    const s = makeWorldListState();
    s.worlds = [entry('a', 'x', 0), entry('b', 'y', 0)];
    deleteWorld(s, 'a');
    expect(s.worlds.length).toBe(1);
  });

  it('confirmations required', () => {
    expect(requiresConfirmation('delete')).toBe(true);
    expect(requiresConfirmation('restore')).toBe(false);
  });
});
