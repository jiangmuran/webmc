import { describe, it, expect } from 'vitest';
import { createDefaultRegistry } from './registry';

describe('default registry — 1.21 pale garden + flower update', () => {
  const r = createDefaultRegistry();
  const newBlocks = [
    'webmc:pale_oak_log',
    'webmc:pale_oak_leaves',
    'webmc:pale_oak_planks',
    'webmc:resin_clump',
    'webmc:resin_brick',
    'webmc:creaking_heart',
    'webmc:eyeblossom',
    'webmc:closed_eyeblossom',
    'webmc:firefly_bush',
    'webmc:pink_petals',
    'webmc:pitcher_pod',
  ];

  it('every pale garden block resolves by name', () => {
    for (const n of newBlocks) {
      expect(r.byName(n), `missing ${n}`).toBeDefined();
    }
  });

  it('firefly_bush emits dim light', () => {
    const id = r.byName('webmc:firefly_bush');
    expect(id).toBeDefined();
    if (id === undefined) return;
    expect(r.get(id).lightEmission).toBeGreaterThan(0);
    expect(r.get(id).lightEmission).toBeLessThan(15);
  });

  it('creaking_heart is solid and opaque', () => {
    const id = r.byName('webmc:creaking_heart');
    expect(id).toBeDefined();
    if (id === undefined) return;
    expect(r.get(id).solid).toBe(true);
    expect(r.get(id).opaque).toBe(true);
  });

  it('flower-like content blocks are non-solid', () => {
    for (const n of [
      'webmc:eyeblossom',
      'webmc:firefly_bush',
      'webmc:pink_petals',
      'webmc:pitcher_pod',
    ]) {
      const id = r.byName(n);
      expect(id, `missing ${n}`).toBeDefined();
      if (id === undefined) continue;
      expect(r.get(id).solid, `${n} should be non-solid`).toBe(false);
    }
  });
});
