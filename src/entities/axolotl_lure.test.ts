import { describe, it, expect } from 'vitest';
import {
  naturalColor,
  isHatedMob,
  tryBucket,
  releaseFromBucket,
  type Axolotl,
} from './axolotl_lure';

describe('axolotl', () => {
  it('natural spawn never blue (wiki)', () => {
    for (let i = 0; i < 100; i++) {
      const c = naturalColor(() => i / 100);
      expect(c).not.toBe('blue');
      expect(['pink', 'brown', 'gold', 'cyan']).toContain(c);
    }
  });

  it('common colors', () => {
    const c = naturalColor(() => 0.5);
    expect(['pink', 'brown', 'gold', 'cyan']).toContain(c);
  });

  it('hates guardian', () => {
    expect(isHatedMob('guardian')).toBe(true);
    expect(isHatedMob('cow')).toBe(false);
  });

  it('bucket requires empty', () => {
    const a: Axolotl = { hp: 10, color: 'pink', inBucket: false };
    expect(tryBucket({ axolotl: a, emptyBucket: false }).ok).toBe(false);
    const r = tryBucket({ axolotl: a, emptyBucket: true });
    expect(r.ok).toBe(true);
    expect(r.itemId).toBe('webmc:axolotl_bucket');
    expect(a.inBucket).toBe(true);
  });

  it('release', () => {
    const a: Axolotl = { hp: 10, color: 'pink', inBucket: true };
    releaseFromBucket(a);
    expect(a.inBucket).toBe(false);
  });
});
