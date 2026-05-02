import { describe, it, expect } from 'vitest';
import { onShieldBlock, isStunned, decrement, STUN_DURATION } from './ravager_stun';

describe('ravager stun', () => {
  it('shield hit stuns when stun rolls (wiki: 50% chance)', () => {
    const c = onShieldBlock({ shieldHit: true, stunTicks: 0 }, () => 0);
    expect(c.stunTicks).toBe(STUN_DURATION);
    expect(isStunned(c)).toBe(true);
  });

  it('shield hit no-op when stun roll fails', () => {
    const c = onShieldBlock({ shieldHit: true, stunTicks: 0 }, () => 0.99);
    expect(c.stunTicks).toBe(0);
    expect(isStunned(c)).toBe(false);
  });

  it('decrements to 0', () => {
    let c = { shieldHit: false, stunTicks: 2 };
    c = decrement(c);
    c = decrement(c);
    expect(isStunned(c)).toBe(false);
  });
});
