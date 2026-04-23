import { describe, it, expect } from 'vitest';
import { consumeOnHit, brokenAt, unbreakingSurvivesChance, MAX_DURABILITY } from './tool_durability';

describe('tool durability', () => {
  it('netherite lasts longest', () => {
    expect(MAX_DURABILITY['netherite']).toBeGreaterThan(MAX_DURABILITY['diamond'] ?? 0);
  });

  it('unbreaking saves on lucky roll', () => {
    expect(consumeOnHit(100, 3, () => 0)).toBe(100);
  });

  it('no unbreaking always -1', () => {
    expect(consumeOnHit(100, 0, () => 0.5)).toBe(99);
  });

  it('0 is broken', () => {
    expect(brokenAt(0)).toBe(true);
    expect(brokenAt(1)).toBe(false);
  });

  it('chance scales', () => {
    expect(unbreakingSurvivesChance(3)).toBeGreaterThan(unbreakingSurvivesChance(1));
  });
});
