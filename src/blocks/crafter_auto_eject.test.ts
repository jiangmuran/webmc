import { describe, it, expect } from 'vitest';
import { canCraftNow, onCraft, redstonePulseDetection } from './crafter_auto_eject';

describe('crafter auto eject', () => {
  it('crafts when powered + ready', () => {
    expect(canCraftNow({ recipeComplete: true, cooldownTicks: 0, powered: true })).toBe(true);
  });

  it('cooldown blocks', () => {
    expect(canCraftNow({ recipeComplete: true, cooldownTicks: 3, powered: true })).toBe(false);
  });

  it('not ready', () => {
    expect(canCraftNow({ recipeComplete: false, cooldownTicks: 0, powered: true })).toBe(false);
  });

  it('crafting resets', () => {
    const r = onCraft({ recipeComplete: true, cooldownTicks: 0, powered: true });
    expect(r.cooldownTicks).toBeGreaterThan(0);
  });

  it('pulse rising edge only', () => {
    expect(redstonePulseDetection(true, false)).toBe(true);
    expect(redstonePulseDetection(true, true)).toBe(false);
  });
});
