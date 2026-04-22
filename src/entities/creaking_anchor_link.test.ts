import { describe, it, expect } from 'vitest';
import {
  makeHeart,
  isLinkable,
  damageThroughLink,
  onHeartDestroyed,
  canMove,
  LINK_RADIUS,
  HEART_MAX_HP,
} from './creaking_anchor_link';

describe('creaking heart', () => {
  it('link within radius', () => {
    const h = makeHeart({ x: 0, y: 0, z: 0 });
    expect(isLinkable(h, { x: LINK_RADIUS, y: 0, z: 0 })).toBe(true);
    expect(isLinkable(h, { x: LINK_RADIUS + 1, y: 0, z: 0 })).toBe(false);
  });

  it('damage absorbed by heart', () => {
    const h = makeHeart({ x: 0, y: 0, z: 0 });
    const r = damageThroughLink(h, { damage: 2 });
    expect(h.hp).toBe(HEART_MAX_HP - 2);
    expect(r.killed).toBe(false);
  });

  it('heart dies on lethal damage', () => {
    const h = makeHeart({ x: 0, y: 0, z: 0 });
    const r = damageThroughLink(h, { damage: 100 });
    expect(r.killed).toBe(true);
  });

  it('destroy returns bound ids', () => {
    const h = makeHeart({ x: 0, y: 0, z: 0 });
    h.boundCreakingIds.add('c1');
    h.boundCreakingIds.add('c2');
    expect(onHeartDestroyed(h).sort()).toEqual(['c1', 'c2']);
  });

  it('only moves unobserved', () => {
    expect(canMove(false)).toBe(true);
    expect(canMove(true)).toBe(false);
  });
});
