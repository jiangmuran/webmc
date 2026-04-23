import { describe, it, expect } from 'vitest';
import { isOpen, manualInteractionIgnored } from './iron_trapdoor_redstone_only';

describe('iron trapdoor redstone only', () => {
  it('powered open', () => {
    expect(isOpen({ powered: true, rightClicked: false })).toBe(true);
  });

  it('click alone no open', () => {
    expect(isOpen({ powered: false, rightClicked: true })).toBe(false);
  });

  it('manual ignored without power', () => {
    expect(manualInteractionIgnored({ powered: false, rightClicked: true })).toBe(true);
  });

  it('click with power not ignored', () => {
    expect(manualInteractionIgnored({ powered: true, rightClicked: true })).toBe(false);
  });
});
