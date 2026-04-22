import { describe, it, expect } from 'vitest';
import { toggleFromClick, onRedstonePower, blocksMovement, isClimbable } from './trapdoor_open';

describe('trapdoor open', () => {
  const base = {
    open: false,
    half: 'bottom' as const,
    facing: 'north' as const,
    material: 'wood' as const,
    powered: false,
  };

  it('wood toggles on click', () => {
    expect(toggleFromClick(base).open).toBe(true);
  });

  it('iron ignores click', () => {
    expect(toggleFromClick({ ...base, material: 'iron' }).open).toBe(false);
  });

  it('redstone opens', () => {
    expect(onRedstonePower(base, true).open).toBe(true);
  });

  it('closed blocks movement', () => {
    expect(blocksMovement(base)).toBe(true);
  });

  it('open ladder below → climbable', () => {
    expect(isClimbable({ ...base, open: true }, 'ladder')).toBe(true);
  });

  it('open no ladder → not climbable', () => {
    expect(isClimbable({ ...base, open: true }, 'other')).toBe(false);
  });
});
