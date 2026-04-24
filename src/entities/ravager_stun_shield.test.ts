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
  it('shield block applies stun cooldown', () => {
    expect(onShieldBlocked(base).attackCooldown).toBe(STUN_DURATION_TICKS);
  });

  it('tick drains cooldown', () => {
    const s = onShieldBlocked(base);
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
