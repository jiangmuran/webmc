import { describe, it, expect } from 'vitest';
import { barter, BARTER_TABLE } from './piglin_barter_table';

describe('piglin barter', () => {
  it('produces item', () => {
    const r = barter({ rand: () => 0.5 });
    expect(r).not.toBeNull();
  });

  it('items from table', () => {
    for (let i = 0; i < 50; i++) {
      const r = barter({ rand: () => ((i * 13) % 100) / 100 });
      if (r) expect(BARTER_TABLE.find((e) => e.itemId === r.itemId)).toBeTruthy();
    }
  });

  it('counts in range', () => {
    for (let i = 0; i < 30; i++) {
      const r = barter({ rand: () => ((i * 17) % 100) / 100 });
      if (r) {
        const def = BARTER_TABLE.find((e) => e.itemId === r.itemId);
        if (def) {
          expect(r.count).toBeGreaterThanOrEqual(def.min);
          expect(r.count).toBeLessThanOrEqual(def.max);
        }
      }
    }
  });

  it('deterministic', () => {
    const a = barter({ rand: () => 0.3 });
    const b = barter({ rand: () => 0.3 });
    expect(a).toEqual(b);
  });
});
