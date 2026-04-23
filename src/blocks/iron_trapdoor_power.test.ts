import { describe, it, expect } from 'vitest';
import { isOpen, manualOpenBlocked } from './iron_trapdoor_power';

describe('iron trapdoor', () => {
  it('redstone opens', () => {
    expect(isOpen({ redstonePowered: true, clicked: false })).toBe(true);
  });

  it('click without redstone blocked', () => {
    expect(manualOpenBlocked({ redstonePowered: false, clicked: true })).toBe(true);
  });

  it('click with redstone is fine', () => {
    expect(manualOpenBlocked({ redstonePowered: true, clicked: true })).toBe(false);
  });
});
