import { describe, it, expect } from 'vitest';
import { damageBlocked, projectileDeflected, type BlockInput } from './shield_block_direction';

const east: BlockInput = {
  playerYawRadians: 0,
  attackerX: 5,
  attackerZ: 0,
  playerX: 0,
  playerZ: 0,
  hasShield: true,
  raising: true,
};

describe('shield block direction', () => {
  it('attacker in front blocks', () => {
    expect(damageBlocked(east)).toBe(true);
  });

  it('no shield no block', () => {
    expect(damageBlocked({ ...east, hasShield: false })).toBe(false);
  });

  it('not raising no block', () => {
    expect(damageBlocked({ ...east, raising: false })).toBe(false);
  });

  it('attacker behind no block', () => {
    expect(damageBlocked({ ...east, attackerX: -5 })).toBe(false);
  });

  it('projectile also deflected', () => {
    expect(projectileDeflected(east)).toBe(true);
  });
});
