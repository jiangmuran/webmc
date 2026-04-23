import { describe, it, expect } from 'vitest';
import { rollSpruce, foliageRadiusAt, isMegaSpruce } from './tree_spruce';

describe('spruce tree', () => {
  it('height in range', () => {
    const s = rollSpruce(() => 0.5);
    expect(s.height).toBeGreaterThanOrEqual(6);
    expect(s.height).toBeLessThanOrEqual(10);
  });

  it('conical: narrow at top', () => {
    const s = rollSpruce(() => 0.5);
    expect(foliageRadiusAt(s.height, s)).toBe(0);
  });

  it('wider further down', () => {
    const s = rollSpruce(() => 0.5);
    expect(foliageRadiusAt(s.height - 6, s)).toBeGreaterThanOrEqual(
      foliageRadiusAt(s.height - 2, s),
    );
  });

  it('mega spruce biome check', () => {
    expect(isMegaSpruce('old_growth_spruce_taiga')).toBe(true);
    expect(isMegaSpruce('plains')).toBe(false);
  });
});
