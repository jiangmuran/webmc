import { describe, it, expect } from 'vitest';
import {
  onShieldBlocked,
  tick,
  startRoar,
  canAttack,
  STUN_DURATION_TICKS,
  ROAR_DURATION_TICKS,
  type RavagerState,
} from './ravager_stun_shield';

const base: RavagerState = {
  ticksSinceStunned: 999,
  isRoaring: false,
  roarTicksRemaining: 0,
  attackCooldown: 0,
};

describe('ravager stun/shield', () => {
  it('shield block applies stun cooldown when stun rolls (wiki: 50% chance)', () => {
    expect(onShieldBlocked(base, () => 0).attackCooldown).toBe(STUN_DURATION_TICKS);
  });

  it('shield block has no effect when stun roll fails (wiki: 50% no-op)', () => {
    const s = onShieldBlocked(base, () => 0.99);
    expect(s.attackCooldown).toBe(0);
  });

  it('tick drains cooldown', () => {
    const s = onShieldBlocked(base, () => 0);
    expect(tick(s).attackCooldown).toBe(STUN_DURATION_TICKS - 1);
  });

  it('roar disables attack', () => {
    expect(canAttack(startRoar(base))).toBe(false);
  });

  it('ready attacks after cooldown', () => {
    expect(canAttack(base)).toBe(true);
  });

  it('roar timer elapses', () => {
    let s = startRoar(base);
    for (let i = 0; i < ROAR_DURATION_TICKS + 1; i++) s = tick(s);
    expect(s.isRoaring).toBe(false);
  });
});
