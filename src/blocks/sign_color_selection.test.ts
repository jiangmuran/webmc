import { describe, it, expect } from 'vitest';
import { makeSign, applyDye, applyGlowInk, removeGlow, wax } from './sign_color_selection';

describe('sign color', () => {
  it('dye changes color', () => {
    const s = makeSign();
    expect(applyDye(s, 'front', 'red')).toBe(true);
    expect(s.front.color).toBe('red');
  });

  it('glow ink sets glowing', () => {
    const s = makeSign();
    applyGlowInk(s, 'back');
    expect(s.back.glowing).toBe(true);
  });

  it('remove glow', () => {
    const s = makeSign();
    applyGlowInk(s, 'front');
    removeGlow(s, 'front');
    expect(s.front.glowing).toBe(false);
  });

  it('wax blocks changes', () => {
    const s = makeSign();
    wax(s);
    expect(applyDye(s, 'front', 'red')).toBe(false);
    expect(applyGlowInk(s, 'front')).toBe(false);
  });
});
