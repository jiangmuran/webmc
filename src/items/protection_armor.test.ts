import { describe, it, expect } from 'vitest';
import { epf, appliesTo, damageAfter, MAX_EPF } from './protection_armor';

describe('protection armor', () => {
  it('generic protection applies to all', () => {
    expect(appliesTo('protection', 'fire')).toBe(true);
    expect(appliesTo('protection', 'arrow')).toBe(true);
  });

  it('fire prot only fire/lava', () => {
    expect(appliesTo('fire_protection', 'fire')).toBe(true);
    expect(appliesTo('fire_protection', 'arrow')).toBe(false);
  });

  it('projectile prot covers fireball', () => {
    expect(appliesTo('projectile_protection', 'fireball')).toBe(true);
  });

  it('epf scales', () => {
    expect(epf('blast_protection', 4)).toBe(6);
  });

  it('damage capped at MAX_EPF', () => {
    expect(damageAfter(100, 100)).toBe(damageAfter(100, MAX_EPF));
  });

  it('zero epf = raw', () => {
    expect(damageAfter(50, 0)).toBe(50);
  });
});
