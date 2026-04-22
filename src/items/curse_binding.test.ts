import { describe, it, expect } from 'vitest';
import { canUnequip, appliesToSlot, removableByGrindstone } from './curse_binding';

describe('curse of binding', () => {
  it('no curse freely removes', () => {
    expect(
      canUnequip({ hasCurse: false, playerDead: false, armorBroken: false, isCreative: false }),
    ).toBe(true);
  });

  it('cursed alive locked', () => {
    expect(
      canUnequip({ hasCurse: true, playerDead: false, armorBroken: false, isCreative: false }),
    ).toBe(false);
  });

  it('creative bypasses', () => {
    expect(
      canUnequip({ hasCurse: true, playerDead: false, armorBroken: false, isCreative: true }),
    ).toBe(true);
  });

  it('death releases', () => {
    expect(
      canUnequip({ hasCurse: true, playerDead: true, armorBroken: false, isCreative: false }),
    ).toBe(true);
  });

  it('armor break releases', () => {
    expect(
      canUnequip({ hasCurse: true, playerDead: false, armorBroken: true, isCreative: false }),
    ).toBe(true);
  });

  it('grindstone cannot remove', () => {
    expect(removableByGrindstone()).toBe(false);
  });

  it('applies to armor slots', () => {
    expect(appliesToSlot('helmet')).toBe(true);
    expect(appliesToSlot('elytra')).toBe(true);
    expect(appliesToSlot('mainhand')).toBe(false);
  });
});
