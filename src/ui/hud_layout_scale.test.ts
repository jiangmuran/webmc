import { describe, it, expect } from 'vitest';
import { computeLayout, hotbarSlotCenter } from './hud_layout_scale';

describe('hud layout scale', () => {
  it('hotbar centered horizontally', () => {
    const l = computeLayout({ w: 1920, h: 1080, hudScale: 1 });
    expect(l.hotbarX + l.hotbarW / 2).toBeCloseTo(1920 / 2, 0);
  });

  it('scale enlarges hotbar', () => {
    const s1 = computeLayout({ w: 1000, h: 600, hudScale: 1 });
    const s2 = computeLayout({ w: 1000, h: 600, hudScale: 2 });
    expect(s2.hotbarW).toBeGreaterThan(s1.hotbarW);
  });

  it('hotbar at bottom', () => {
    const l = computeLayout({ w: 1000, h: 600, hudScale: 1 });
    expect(l.hotbarY).toBeGreaterThan(500);
  });

  it('hearts above hotbar', () => {
    const l = computeLayout({ w: 1000, h: 600, hudScale: 1 });
    expect(l.heartsY).toBeLessThan(l.hotbarY);
  });

  it('slot centers spaced', () => {
    const l = computeLayout({ w: 1000, h: 600, hudScale: 1 });
    const c0 = hotbarSlotCenter(l, 0);
    const c1 = hotbarSlotCenter(l, 1);
    expect(c1.x).toBeGreaterThan(c0.x);
  });
});
