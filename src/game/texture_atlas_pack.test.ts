import { describe, it, expect } from 'vitest';
import { packAtlas, lookup } from './texture_atlas_pack';

describe('atlas pack', () => {
  it('empty = small', () => {
    const a = packAtlas([]);
    expect(a.entries.length).toBe(0);
  });

  it('single 16px', () => {
    const a = packAtlas([{ id: 'stone', sizePx: 16 }]);
    expect(a.sizePx).toBeGreaterThanOrEqual(16);
    expect(lookup(a, 'stone')).not.toBeNull();
  });

  it('many tiles pow-of-2 side', () => {
    const ts = Array.from({ length: 100 }, (_, i) => ({ id: `t${i}`, sizePx: 16 }));
    const a = packAtlas(ts);
    // pow of 2
    expect((a.sizePx & (a.sizePx - 1)) === 0).toBe(true);
  });

  it('uv normalized to 0..1', () => {
    const a = packAtlas([
      { id: 'a', sizePx: 16 },
      { id: 'b', sizePx: 16 },
    ]);
    for (const e of a.entries) {
      expect(e.u).toBeGreaterThanOrEqual(0);
      expect(e.u + e.du).toBeLessThanOrEqual(1);
    }
  });

  it('lookup missing = null', () => {
    const a = packAtlas([{ id: 'x', sizePx: 16 }]);
    expect(lookup(a, 'y')).toBeNull();
  });
});
