import { describe, it, expect } from 'vitest';
import { tableFor, rollRuinLoot } from './structure_ruin_loot';

describe('ocean ruin loot', () => {
  it('warm has map', () => {
    const t = tableFor('warm');
    expect(t.find((e) => e.itemId === 'webmc:buried_treasure_map')).toBeTruthy();
  });

  it('cold has bread', () => {
    const t = tableFor('cold');
    expect(t.find((e) => e.itemId === 'webmc:bread')).toBeTruthy();
  });

  it('rolls produce N items', () => {
    const r = rollRuinLoot({ kind: 'warm', rolls: 5, rand: () => 0.5 });
    expect(r.length).toBe(5);
  });

  it('deterministic', () => {
    const a = rollRuinLoot({ kind: 'cold', rolls: 3, rand: () => 0.1 });
    const b = rollRuinLoot({ kind: 'cold', rolls: 3, rand: () => 0.1 });
    expect(a).toEqual(b);
  });
});
