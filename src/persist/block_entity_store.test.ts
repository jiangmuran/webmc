import { describe, it, expect } from 'vitest';
import { set, get, remove, count, key } from './block_entity_store';

describe('block entity store', () => {
  it('set + get', () => {
    const s = { byKey: new Map() };
    set(s, { id: 'chest', x: 1, y: 64, z: 2, nbt: {} });
    expect(get(s, 1, 64, 2)?.id).toBe('chest');
  });

  it('missing returns undefined', () => {
    const s = { byKey: new Map() };
    expect(get(s, 0, 0, 0)).toBeUndefined();
  });

  it('remove clears', () => {
    const s = { byKey: new Map() };
    set(s, { id: 'furnace', x: 0, y: 0, z: 0, nbt: {} });
    expect(remove(s, 0, 0, 0)).toBe(true);
    expect(count(s)).toBe(0);
  });

  it('key format', () => {
    expect(key(1, 2, 3)).toBe('1,2,3');
  });
});
