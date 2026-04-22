import { describe, it, expect } from 'vitest';
import { attemptShieldBlock } from './shield';

describe('shield', () => {
  const forward = { x: 0, y: 0, z: 1 }; // player facing +z

  it('blocks a frontal hit', () => {
    const r = attemptShieldBlock({
      incomingDirection: { x: 0, y: 0, z: -1 }, // attacker from +z, hit travels -z
      playerForward: forward,
      isBlocking: true,
      shieldDurability: 100,
      disabled: false,
    });
    expect(r.blocked).toBe(true);
    expect(r.damageMultiplier).toBe(0);
  });

  it('fails to block a hit from behind', () => {
    const r = attemptShieldBlock({
      incomingDirection: { x: 0, y: 0, z: 1 }, // attacker from behind, hit travels +z
      playerForward: forward,
      isBlocking: true,
      shieldDurability: 100,
      disabled: false,
    });
    expect(r.blocked).toBe(false);
  });

  it('does not block if player is not blocking', () => {
    const r = attemptShieldBlock({
      incomingDirection: { x: 0, y: 0, z: -1 },
      playerForward: forward,
      isBlocking: false,
      shieldDurability: 100,
      disabled: false,
    });
    expect(r.blocked).toBe(false);
  });

  it('does not block if shield is disabled (axe hit)', () => {
    const r = attemptShieldBlock({
      incomingDirection: { x: 0, y: 0, z: -1 },
      playerForward: forward,
      isBlocking: true,
      shieldDurability: 100,
      disabled: true,
    });
    expect(r.blocked).toBe(false);
  });

  it('broken shield cannot block', () => {
    const r = attemptShieldBlock({
      incomingDirection: { x: 0, y: 0, z: -1 },
      playerForward: forward,
      isBlocking: true,
      shieldDurability: 0,
      disabled: false,
    });
    expect(r.blocked).toBe(false);
  });

  it('records 1 damage on successful block', () => {
    const r = attemptShieldBlock({
      incomingDirection: { x: 0, y: 0, z: -1 },
      playerForward: forward,
      isBlocking: true,
      shieldDurability: 50,
      disabled: false,
    });
    expect(r.shieldDamage).toBe(1);
  });
});
