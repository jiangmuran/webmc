import { describe, it, expect } from 'vitest';
import { onShieldBlock, isStunned, decrement, STUN_DURATION } from './ravager_stun';

describe('ravager stun', () => {
  it('shield hit stuns', () => {
    const c = onShieldBlock({ shieldHit: true, stunTicks: 0 });
    expect(c.stunTicks).toBe(STUN_DURATION);
    expect(isStunned(c)).toBe(true);
  });

  it('decrements to 0', () => {
    let c = { shieldHit: false, stunTicks: 2 };
    c = decrement(c);
    c = decrement(c);
    expect(isStunned(c)).toBe(false);
  });
});
