import { describe, it, expect } from 'vitest';
import { canUnlock, consumesKey, dropsOminousLoot } from './ominous_vault_activate';

describe('ominous vault', () => {
  it('unlocks with ominous key', () => {
    expect(
      canUnlock({ withOminousKey: true, playerHasBadOmen: true, previouslyUsedByPlayer: false }),
    ).toBe(true);
  });

  it('no key no unlock', () => {
    expect(
      canUnlock({ withOminousKey: false, playerHasBadOmen: true, previouslyUsedByPlayer: false }),
    ).toBe(false);
  });

  it('single use per player', () => {
    expect(
      canUnlock({ withOminousKey: true, playerHasBadOmen: true, previouslyUsedByPlayer: true }),
    ).toBe(false);
  });

  it('drops on unlock', () => {
    expect(
      dropsOminousLoot({ withOminousKey: true, playerHasBadOmen: true, previouslyUsedByPlayer: false }),
    ).toBe(true);
  });

  it('key consumed', () => {
    expect(consumesKey()).toBe(true);
  });
});
