import { describe, it, expect } from 'vitest';
import {
  transition,
  contactDamage,
  contactPoison,
  fullyInflated,
  poisonDurationTicks,
  POISON_AMPLIFIER,
  POISON_TICKS_SEMI,
  POISON_TICKS_FULL,
} from './pufferfish_inflate';

describe('pufferfish inflate', () => {
  it('inflates with threat', () => {
    let s = { state: 0 as const, threatNearby: true };
    s = transition(s) as typeof s;
    expect(s.state).toBe(1);
  });

  it('deflates without threat', () => {
    const s = transition({ state: 2, threatNearby: false });
    expect(s.state).toBe(1);
  });

  it('caps at 2', () => {
    const s = transition({ state: 2, threatNearby: true });
    expect(s.state).toBe(2);
  });

  it('damage scales', () => {
    expect(contactDamage(0)).toBe(0);
    expect(contactDamage(2)).toBe(2);
  });

  it('poison from half', () => {
    expect(contactPoison(0)).toBe(false);
    expect(contactPoison(1)).toBe(true);
  });

  it('fullyInflated', () => {
    expect(fullyInflated({ state: 2, threatNearby: false })).toBe(true);
  });

  it('poison duration: semi 3s / full 6s (wiki)', () => {
    expect(POISON_TICKS_SEMI).toBe(60);
    expect(POISON_TICKS_FULL).toBe(120);
    expect(poisonDurationTicks(0)).toBe(0);
    expect(poisonDurationTicks(1)).toBe(60);
    expect(poisonDurationTicks(2)).toBe(120);
  });

  it('poison amplifier 0 = Poison I (wiki: just "Poison")', () => {
    expect(POISON_AMPLIFIER).toBe(0);
  });
});
