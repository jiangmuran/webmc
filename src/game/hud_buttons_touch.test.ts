import { describe, it, expect } from 'vitest';
import { defaultLayout, hitTest } from './hud_buttons_touch';

const q = { screenWidth: 1000, screenHeight: 800, isCreative: false, isTouchDevice: true };

describe('touch hud', () => {
  it('empty on non-touch', () => {
    expect(defaultLayout({ ...q, isTouchDevice: false })).toEqual([]);
  });

  it('non-creative hides fly', () => {
    const l = defaultLayout(q);
    expect(l.find((b) => b.id === 'fly')?.visible).toBe(false);
  });

  it('creative shows fly', () => {
    const l = defaultLayout({ ...q, isCreative: true });
    expect(l.find((b) => b.id === 'fly')?.visible).toBe(true);
  });

  it('hit test', () => {
    const l = defaultLayout(q);
    const jumpBtn = l.find((b) => b.id === 'jump');
    if (jumpBtn) {
      const r = hitTest(l, q, jumpBtn.ux * 1000, jumpBtn.uy * 800);
      expect(r).toBe('jump');
    }
  });

  it('miss returns null', () => {
    const l = defaultLayout(q);
    expect(hitTest(l, q, 0, 0)).toBeNull();
  });
});
