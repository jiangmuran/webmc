import { describe, it, expect } from 'vitest';
import { electrify, explosionPower, killDrop, makeChargedCreeper } from './charged_creeper';

describe('charged creeper', () => {
  it('plain creeper explodes with power 3 (wiki)', () => {
    expect(explosionPower(makeChargedCreeper())).toBe(3);
  });

  it('lightning charges once, doubles explosion power to 6 (wiki)', () => {
    const c = makeChargedCreeper();
    expect(electrify(c)).toBe(true);
    expect(electrify(c)).toBe(false);
    expect(explosionPower(c)).toBe(6);
  });

  it('charged + zombie kill → zombie head drop', () => {
    const c = makeChargedCreeper();
    electrify(c);
    expect(killDrop(c, 'zombie')).toBe('webmc:zombie_head');
  });

  it('non-charged + kill → no skull', () => {
    const c = makeChargedCreeper();
    expect(killDrop(c, 'zombie')).toBeNull();
  });

  it('unknown victim → no skull', () => {
    const c = makeChargedCreeper();
    electrify(c);
    expect(killDrop(c, 'axolotl')).toBeNull();
  });

  it('bogged → no skull (wiki: bogged not in charged-creeper drop list)', () => {
    const c = makeChargedCreeper();
    electrify(c);
    expect(killDrop(c, 'bogged')).toBeNull();
  });

  it('charged + skeleton → skeleton skull', () => {
    const c = makeChargedCreeper();
    electrify(c);
    expect(killDrop(c, 'skeleton')).toBe('webmc:skeleton_skull');
  });

  it('charged + piglin → piglin head', () => {
    const c = makeChargedCreeper();
    electrify(c);
    expect(killDrop(c, 'piglin')).toBe('webmc:piglin_head');
  });
});
