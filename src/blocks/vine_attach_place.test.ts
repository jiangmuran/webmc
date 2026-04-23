import { describe, it, expect } from 'vitest';
import {
  hasAttachment,
  canSpread,
  breaksIfNoAttachment,
  silkTouchRequired,
} from './vine_attach_place';

describe('vine attach place', () => {
  it('no attachment breaks', () => {
    expect(breaksIfNoAttachment({ attachedFaces: new Set() })).toBe(true);
  });

  it('attached stays', () => {
    expect(breaksIfNoAttachment({ attachedFaces: new Set(['north']) })).toBe(false);
    expect(hasAttachment({ attachedFaces: new Set(['up']) })).toBe(true);
  });

  it('spreads sometimes', () => {
    expect(canSpread({ attachedFaces: new Set(['north']) }, () => 0)).toBe(true);
  });

  it('shears not auto-drop', () => {
    expect(silkTouchRequired()).toBe(true);
  });
});
