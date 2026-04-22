import { describe, it, expect } from 'vitest';
import {
  deflectFireball,
  FIREBALL_DIRECT_DAMAGE,
  FIREBALL_EXPLOSION_POWER,
} from './ghast_fire_deflect';

describe('ghast fireball deflect', () => {
  it('punch reverses velocity', () => {
    const r = deflectFireball({
      fireballVelocity: { x: 1, y: 0, z: 0 },
      hitMethod: 'punch',
      critical: false,
      ghastPos: null,
      hitPos: { x: 0, y: 0, z: 0 },
    });
    expect(r.newVelocity.x).toBe(-1);
    expect(r.deflected).toBe(true);
  });

  it('shield works like punch', () => {
    const r = deflectFireball({
      fireballVelocity: { x: 2, y: 0, z: 0 },
      hitMethod: 'shield',
      critical: false,
      ghastPos: null,
      hitPos: { x: 0, y: 0, z: 0 },
    });
    expect(r.newVelocity.x).toBe(-2);
  });

  it('crossbow destroys, not deflect', () => {
    const r = deflectFireball({
      fireballVelocity: { x: 1, y: 0, z: 0 },
      hitMethod: 'crossbow',
      critical: false,
      ghastPos: null,
      hitPos: { x: 0, y: 0, z: 0 },
    });
    expect(r.deflected).toBe(false);
  });

  it('critical aims at ghast', () => {
    const r = deflectFireball({
      fireballVelocity: { x: 1, y: 0, z: 0 },
      hitMethod: 'sword',
      critical: true,
      ghastPos: { x: -10, y: 0, z: 0 },
      hitPos: { x: 0, y: 0, z: 0 },
    });
    expect(r.newVelocity.x).toBeLessThan(0);
  });

  it('explosion power + damage constants', () => {
    expect(FIREBALL_EXPLOSION_POWER).toBe(1);
    expect(FIREBALL_DIRECT_DAMAGE).toBe(6);
  });
});
