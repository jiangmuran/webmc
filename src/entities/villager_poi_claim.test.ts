import { describe, it, expect } from 'vitest';
import { claim, release, isFree, countClaimedBy, type Poi } from './villager_poi_claim';

function mk(id: string): Poi {
  return { id, type: 'bed', claimedBy: null };
}

describe('villager poi claim', () => {
  it('free claim succeeds', () => {
    const p = mk('p1');
    expect(claim(p, 'v1')).toBe(true);
    expect(p.claimedBy).toBe('v1');
  });

  it('cannot claim another villagers poi', () => {
    const p = mk('p1');
    claim(p, 'v1');
    expect(claim(p, 'v2')).toBe(false);
  });

  it('re-claim by same villager ok', () => {
    const p = mk('p1');
    claim(p, 'v1');
    expect(claim(p, 'v1')).toBe(true);
  });

  it('release only by owner', () => {
    const p = mk('p1');
    claim(p, 'v1');
    expect(release(p, 'v2')).toBe(false);
    expect(release(p, 'v1')).toBe(true);
    expect(isFree(p)).toBe(true);
  });

  it('count claimed', () => {
    const a = mk('a');
    const b = mk('b');
    const c = mk('c');
    const ps = [a, b, c];
    claim(a, 'v1');
    claim(b, 'v1');
    claim(c, 'v2');
    expect(countClaimedBy(ps, 'v1')).toBe(2);
  });
});
