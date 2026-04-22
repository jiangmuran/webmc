import { describe, it, expect } from 'vitest';
import { crosshairStyle, interactRange } from './crosshair_target';

describe('crosshair', () => {
  it('none = white plus', () => {
    const s = crosshairStyle(null);
    expect(s.color).toBe('white');
    expect(s.shape).toBe('plus');
  });

  it('hostile red', () => {
    expect(crosshairStyle({ kind: 'mob_hostile', distance: 2 }).color).toBe('red');
  });

  it('sign green square', () => {
    expect(crosshairStyle({ kind: 'sign_editable', distance: 1 }).shape).toBe('square');
  });

  it('creative range larger', () => {
    expect(interactRange(true)).toBeGreaterThan(interactRange(false));
  });
});
