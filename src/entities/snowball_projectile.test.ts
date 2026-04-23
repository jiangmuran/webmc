import { describe, it, expect } from 'vitest';
import { damageOnHit, knockbackForce } from './snowball_projectile';

describe('snowball projectile', () => {
  it('damages blaze', () => {
    expect(damageOnHit({ target: 'blaze' })).toBe(3);
  });

  it('damages wither', () => {
    expect(damageOnHit({ target: 'wither' })).toBe(3);
  });

  it('no damage to others', () => {
    expect(damageOnHit({ target: 'zombie' })).toBe(0);
  });

  it('knockback force positive', () => {
    expect(knockbackForce()).toBeGreaterThan(0);
  });
});
