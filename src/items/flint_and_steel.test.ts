import { describe, it, expect } from 'vitest';
import { useFlintAndSteel } from './flint_and_steel';

describe('flint & steel', () => {
  it('ignites air_top and decrements durability', () => {
    const r = useFlintAndSteel({ target: 'air_top', durability: 64 });
    expect(r.accepted).toBe(true);
    expect(r.newDurability).toBe(63);
  });

  it('ignites TNT', () => {
    const r = useFlintAndSteel({ target: 'tnt', durability: 10 });
    expect(r.accepted).toBe(true);
  });

  it('refuses invalid target', () => {
    const r = useFlintAndSteel({ target: 'invalid', durability: 10 });
    expect(r.accepted).toBe(false);
    expect(r.newDurability).toBe(10);
  });

  it('refuses when broken', () => {
    const r = useFlintAndSteel({ target: 'air_top', durability: 0 });
    expect(r.accepted).toBe(false);
    expect(r.reason).toBe('broken');
  });
});
