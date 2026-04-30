import { describe, it, expect } from 'vitest';
import {
  PHANTOM_CONTACT_DAMAGE,
  PHANTOM_CONTACT_DAMAGE_HARD,
  makePhantomState,
  phantomContactDamage,
  tickPhantom,
} from './phantom_dive';

describe('phantom dive', () => {
  it('enters swoop when close + circled for 2s', () => {
    const s = makePhantomState();
    tickPhantom(s, { dtSec: 3, distanceToPlayer: 10, isDay: false });
    expect(s.phase).toBe('swooping');
  });

  it('damages on contact during swoop', () => {
    const s = makePhantomState();
    s.phase = 'swooping';
    const r = tickPhantom(s, { dtSec: 0.1, distanceToPlayer: 1, isDay: false });
    expect(r.dealsContactDamage).toBe(true);
  });

  it('takes sun damage in daylight', () => {
    const s = makePhantomState();
    const r = tickPhantom(s, { dtSec: 0.1, distanceToPlayer: 30, isDay: true });
    expect(r.takesSunDamage).toBe(true);
  });

  it('cycles swoop → retreat → circle', () => {
    const s = makePhantomState();
    s.phase = 'swooping';
    tickPhantom(s, { dtSec: 4, distanceToPlayer: 10, isDay: false });
    expect(s.phase).toBe('retreating');
    tickPhantom(s, { dtSec: 3, distanceToPlayer: 10, isDay: false });
    expect(s.phase).toBe('circling');
  });

  it('Java damage 2 / Hard 3 (wiki)', () => {
    expect(PHANTOM_CONTACT_DAMAGE).toBe(2);
    expect(PHANTOM_CONTACT_DAMAGE_HARD).toBe(3);
    expect(phantomContactDamage('easy')).toBe(2);
    expect(phantomContactDamage('normal')).toBe(2);
    expect(phantomContactDamage('hard')).toBe(3);
  });
});
