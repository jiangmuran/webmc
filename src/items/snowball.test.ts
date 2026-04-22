import { describe, it, expect } from 'vitest';
import { SNOWBALL_KNOCKBACK, damageOnHit, makeSnowball, tickSnowball } from './snowball';

describe('snowball', () => {
  it('flies forward + falls', () => {
    const s = makeSnowball({ x: 0, y: 70, z: 0 }, { x: 1, y: 0, z: 0 });
    tickSnowball(s, { isSolid: () => false, dtSec: 0.1 });
    expect(s.position.x).toBeGreaterThan(0);
  });

  it('impacts on solid block', () => {
    const s = makeSnowball({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 });
    const r = tickSnowball(s, { isSolid: () => true, dtSec: 0.1 });
    expect(r.impacted).toBe(true);
  });

  it('blaze takes 3 damage', () => {
    expect(damageOnHit('blaze')).toBe(3);
  });

  it('other mobs take 0 damage (knockback only)', () => {
    expect(damageOnHit('zombie')).toBe(0);
  });

  it('knockback constant set', () => {
    expect(SNOWBALL_KNOCKBACK).toBeGreaterThan(0);
  });
});
