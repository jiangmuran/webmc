import { describe, it, expect } from 'vitest';
import { entriesForTab, searchMatches, HOTBAR_PRESETS } from './creative_inventory';

const data = [
  { id: 'stone', tab: 'building_blocks' as const },
  { id: 'oak_sapling', tab: 'natural' as const },
  { id: 'redstone_dust', tab: 'redstone' as const },
];

describe('creative inventory', () => {
  it('tab filter', () => {
    expect(entriesForTab(data, 'natural')).toHaveLength(1);
  });

  it('search returns all', () => {
    expect(entriesForTab(data, 'search')).toHaveLength(3);
  });

  it('search by substring', () => {
    expect(searchMatches(data, 'redstone')).toHaveLength(1);
  });

  it('case-insensitive', () => {
    expect(searchMatches(data, 'STONE')).toHaveLength(2);
  });

  it('9 saved hotbars', () => {
    expect(HOTBAR_PRESETS).toBe(9);
  });
});
