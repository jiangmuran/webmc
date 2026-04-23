import { describe, it, expect } from 'vitest';
import { crosshairOpacity, charged } from './hud_crosshair_dynamic';

describe('hud crosshair dynamic', () => {
  it('faded idle', () => {
    expect(
      crosshairOpacity({ weaponCharge: 0, looksAtEntity: false, looksAtBlockOutline: false }),
    ).toBeLessThan(1);
  });

  it('full on target', () => {
    expect(
      crosshairOpacity({ weaponCharge: 0, looksAtEntity: true, looksAtBlockOutline: false }),
    ).toBe(1);
  });

  it('charged at 1', () => {
    expect(charged({ weaponCharge: 1, looksAtEntity: false, looksAtBlockOutline: false })).toBe(
      true,
    );
    expect(charged({ weaponCharge: 0.5, looksAtEntity: false, looksAtBlockOutline: false })).toBe(
      false,
    );
  });
});
