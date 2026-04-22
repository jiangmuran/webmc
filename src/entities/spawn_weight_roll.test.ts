import { describe, it, expect } from 'vitest';
import { pickSpawn, PLAINS_PASSIVE } from './spawn_weight_roll';

describe('spawn weight', () => {
  it('picks something', () => {
    const r = pickSpawn({ options: PLAINS_PASSIVE, rand: () => 0.5 });
    expect(r).not.toBeNull();
    expect(PLAINS_PASSIVE.find((o) => o.mobId === r?.mobId)).toBeTruthy();
  });

  it('empty = null', () => {
    expect(pickSpawn({ options: [], rand: () => 0 })).toBeNull();
  });

  it('deterministic', () => {
    const a = pickSpawn({ options: PLAINS_PASSIVE, rand: () => 0.2 });
    const b = pickSpawn({ options: PLAINS_PASSIVE, rand: () => 0.2 });
    expect(a?.mobId).toBe(b?.mobId);
  });

  it('group size in range', () => {
    const r = pickSpawn({ options: PLAINS_PASSIVE, rand: () => 0.5 });
    if (r) {
      const opt = PLAINS_PASSIVE.find((o) => o.mobId === r.mobId);
      expect(r.groupSize).toBeGreaterThanOrEqual(opt?.minGroup ?? 0);
      expect(r.groupSize).toBeLessThanOrEqual(opt?.maxGroup ?? 0);
    }
  });
});
