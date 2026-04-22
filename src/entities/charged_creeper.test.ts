import { describe, it, expect } from 'vitest';
import { electrify, explosionPower, killDrop, makeChargedCreeper } from './charged_creeper';

describe('charged creeper', () => {
  it('plain creeper explodes with power 4', () => {
    expect(explosionPower(makeChargedCreeper())).toBe(4);
  });

  it('lightning charges once, doubles explosion power', () => {
    const c = makeChargedCreeper();
    expect(electrify(c)).toBe(true);
    expect(electrify(c)).toBe(false);
    expect(explosionPower(c)).toBe(8);
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
});
