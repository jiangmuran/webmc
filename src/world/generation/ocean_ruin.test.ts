import { describe, it, expect } from 'vitest';
import { OCEAN_RUIN_LOOT, planOceanRuin, rollOceanRuinLoot } from './ocean_ruin';

describe('ocean ruin', () => {
  it('warm variant is tagged', () => {
    const r = planOceanRuin({ variant: 'warm', rng: () => 0.5 });
    expect(r.variant).toBe('warm');
  });

  it('drowned count between 2 and 4', () => {
    const r = planOceanRuin({ variant: 'cold', rng: () => 0.5 });
    expect(r.drownedCount).toBeGreaterThanOrEqual(2);
    expect(r.drownedCount).toBeLessThanOrEqual(4);
  });

  it('tower shape is tall and narrow', () => {
    let calls = 0;
    const rng = () => {
      calls++;
      if (calls === 1) return 0.3; // tower index (1/5 = 0.2..0.4)
      return 0.3; // chest roll — present
    };
    const r = planOceanRuin({ variant: 'warm', rng });
    expect(r.shape).toBe('tower');
  });

  it('loot pool contains buried treasure map', () => {
    const items = OCEAN_RUIN_LOOT.map((e) => e.item);
    expect(items).toContain('webmc:map_buried_treasure');
  });

  it('high roll still returns an item', () => {
    expect(rollOceanRuinLoot(0.99)).not.toBeNull();
  });
});
