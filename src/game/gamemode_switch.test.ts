import { describe, it, expect } from 'vitest';
import { attributesOf, canAttackPlayer, switchGamemode } from './gamemode_switch';

describe('gamemode', () => {
  it('creative is invulnerable + flies', () => {
    const a = attributesOf('creative');
    expect(a.canTakeDamage).toBe(false);
    expect(a.canFly).toBe(true);
  });

  it('adventure cannot break blocks', () => {
    expect(attributesOf('adventure').canBreakBlocks).toBe(false);
  });

  it('spectator is invisible + noclip', () => {
    const a = attributesOf('spectator');
    expect(a.visible).toBe(false);
    expect(a.noclip).toBe(true);
  });

  it('leaving spectator snaps to ground', () => {
    expect(switchGamemode('spectator', 'survival').groundSnap).toBe(true);
  });

  it('same-mode switch does not snap', () => {
    expect(switchGamemode('survival', 'creative').groundSnap).toBe(false);
  });

  it('survival cannot attack creative', () => {
    expect(canAttackPlayer('survival', 'creative')).toBe(false);
  });

  it('spectator cannot attack anyone', () => {
    expect(canAttackPlayer('spectator', 'survival')).toBe(false);
  });

  it('survival can attack survival', () => {
    expect(canAttackPlayer('survival', 'survival')).toBe(true);
  });
});
