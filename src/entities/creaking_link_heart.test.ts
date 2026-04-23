import { describe, it, expect } from 'vitest';
import { cannotMove, diesOnHeartBreak, invulnerableWhileLinked } from './creaking_link_heart';

describe('creaking link heart', () => {
  it('freezes when observed', () => {
    expect(cannotMove({ isLinkedToHeart: true, heartBroken: false, playerLookingAt: true })).toBe(
      true,
    );
  });

  it('moves when not observed', () => {
    expect(cannotMove({ isLinkedToHeart: true, heartBroken: false, playerLookingAt: false })).toBe(
      false,
    );
  });

  it('dies on heart broken', () => {
    expect(
      diesOnHeartBreak({ isLinkedToHeart: true, heartBroken: true, playerLookingAt: false }),
    ).toBe(true);
  });

  it('invulnerable while linked', () => {
    expect(
      invulnerableWhileLinked({
        isLinkedToHeart: true,
        heartBroken: false,
        playerLookingAt: false,
      }),
    ).toBe(true);
  });
});
