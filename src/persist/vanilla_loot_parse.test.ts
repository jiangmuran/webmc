import { describe, it, expect } from 'vitest';
import { parseVanillaLootTable, LootParseError } from './vanilla_loot_parse';

describe('vanilla loot table parser', () => {
  it('parses a simple block loot drop', () => {
    const lt = parseVanillaLootTable(
      JSON.stringify({
        type: 'minecraft:block',
        pools: [
          {
            rolls: 1,
            entries: [{ type: 'minecraft:item', name: 'minecraft:cobblestone' }],
          },
        ],
      }),
    );
    expect(lt.type).toBe('block');
    expect(lt.pools.length).toBe(1);
    expect(lt.pools[0]?.rolls).toEqual({ min: 1, max: 1 });
    const e = lt.pools[0]?.entries[0];
    expect(e?.type).toBe('item');
    expect(e?.name).toBe('webmc:cobblestone');
    expect(e?.weight).toBe(1);
    expect(e?.countMin).toBe(1);
    expect(e?.countMax).toBe(1);
  });

  it('extracts rolls range and weight', () => {
    const lt = parseVanillaLootTable(
      JSON.stringify({
        type: 'minecraft:chest',
        pools: [
          {
            rolls: { min: 2, max: 5 },
            entries: [
              { type: 'minecraft:item', name: 'minecraft:bread', weight: 3 },
              { type: 'minecraft:item', name: 'minecraft:apple', weight: 1 },
            ],
          },
        ],
      }),
    );
    expect(lt.pools[0]?.rolls).toEqual({ min: 2, max: 5 });
    expect(lt.pools[0]?.entries[0]?.weight).toBe(3);
    expect(lt.pools[0]?.entries[1]?.name).toBe('webmc:apple');
  });

  it('extracts set_count function range', () => {
    const lt = parseVanillaLootTable(
      JSON.stringify({
        type: 'minecraft:block',
        pools: [
          {
            rolls: 1,
            entries: [
              {
                type: 'minecraft:item',
                name: 'minecraft:wheat_seeds',
                functions: [
                  {
                    function: 'minecraft:set_count',
                    count: { min: 0, max: 3 },
                  },
                ],
              },
            ],
          },
        ],
      }),
    );
    const e = lt.pools[0]?.entries[0];
    expect(e?.countMin).toBe(0);
    expect(e?.countMax).toBe(3);
  });

  it('handles tag entries with # prefix', () => {
    const lt = parseVanillaLootTable(
      JSON.stringify({
        type: 'minecraft:chest',
        pools: [
          {
            rolls: 1,
            entries: [{ type: 'minecraft:tag', name: 'minecraft:music_discs' }],
          },
        ],
      }),
    );
    expect(lt.pools[0]?.entries[0]?.type).toBe('tag');
    expect(lt.pools[0]?.entries[0]?.name).toBe('#webmc:music_discs');
  });

  it('handles empty entries (no drop)', () => {
    const lt = parseVanillaLootTable(
      JSON.stringify({
        type: 'minecraft:chest',
        pools: [{ rolls: 1, entries: [{ type: 'minecraft:empty', weight: 5 }] }],
      }),
    );
    expect(lt.pools[0]?.entries[0]?.type).toBe('empty');
    expect(lt.pools[0]?.entries[0]?.weight).toBe(5);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaLootTable('not json')).toThrow(LootParseError);
  });
});
