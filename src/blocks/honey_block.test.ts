import { describe, it, expect } from 'vitest';
import { applyHoneyBlockModifiers, stickinessCompatible } from './honey_block';

describe('honey block', () => {
  it('slows horizontal movement on top', () => {
    const v = applyHoneyBlockModifiers({ x: 5, y: 0, z: 5 }, { onTop: true, onSide: false });
    expect(v.x).toBeCloseTo(2, 3);
    expect(v.z).toBeCloseTo(2, 3);
  });

  it('sticks the player to the side (slow slide)', () => {
    const v = applyHoneyBlockModifiers({ x: 0, y: -10, z: 0 }, { onTop: false, onSide: true });
    expect(v.y).toBeGreaterThan(-1);
  });

  it('no side contact → normal velocity', () => {
    const v = applyHoneyBlockModifiers({ x: 3, y: -10, z: 2 }, { onTop: false, onSide: false });
    expect(v).toEqual({ x: 3, y: -10, z: 2 });
  });

  it('slime sticks to slime, honey sticks to honey — but not each other', () => {
    expect(stickinessCompatible('slime', 'slime')).toBe(true);
    expect(stickinessCompatible('honey', 'honey')).toBe(true);
    expect(stickinessCompatible('slime', 'honey')).toBe(false);
  });
});
