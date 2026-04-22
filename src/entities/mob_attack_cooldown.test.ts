import { describe, it, expect } from 'vitest';
import {
  attackSpeedOf,
  makeAttackCooldown,
  tickAttackCooldown,
  triggerAttack,
} from './mob_attack_cooldown';

describe('mob attack cooldown', () => {
  it('starts ready', () => {
    const s = makeAttackCooldown();
    expect(tickAttackCooldown(s, { attackSpeedPerSec: 1, dtSec: 0 }).canAttack).toBe(true);
  });

  it('trigger locks out for 1/speed seconds', () => {
    const s = makeAttackCooldown();
    triggerAttack(s, 1.0);
    expect(tickAttackCooldown(s, { attackSpeedPerSec: 1, dtSec: 0.5 }).canAttack).toBe(false);
    expect(tickAttackCooldown(s, { attackSpeedPerSec: 1, dtSec: 1.0 }).canAttack).toBe(true);
  });

  it('zero speed = locked forever', () => {
    const s = makeAttackCooldown();
    triggerAttack(s, 0);
    expect(tickAttackCooldown(s, { attackSpeedPerSec: 0, dtSec: 1000 }).canAttack).toBe(false);
  });

  it('table has known mobs', () => {
    expect(attackSpeedOf('zombie')).toBe(1);
    expect(attackSpeedOf('ravager')).toBe(0.5);
    expect(attackSpeedOf('unknown')).toBe(1.0);
  });
});
