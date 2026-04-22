import { describe, it, expect } from 'vitest';
import {
  damageTintAlpha,
  HEARTS_PER_ROW,
  renderBubbles,
  renderHearts,
  renderHunger,
  xpBarFraction,
  type HudStats,
} from './status_bar_render';

const DEFAULT: HudStats = {
  health: 20,
  maxHealth: 20,
  absorption: 0,
  hunger: 20,
  saturation: 5,
  breathSec: 15,
  maxBreathSec: 15,
  armor: 0,
  xpLevel: 0,
  xpProgress: 0,
  selectedHotbarSlot: 0,
};

describe('hud status bar', () => {
  it('10 hearts per row', () => {
    expect(HEARTS_PER_ROW).toBe(10);
  });

  it('full health renders 10 full hearts', () => {
    const hearts = renderHearts(DEFAULT);
    expect(hearts.filter((h) => h.kind === 'full').length).toBe(10);
  });

  it('half heart at odd HP', () => {
    const hearts = renderHearts({ ...DEFAULT, health: 19 });
    expect(hearts.some((h) => h.kind === 'half')).toBe(true);
  });

  it('absorption adds extra hearts', () => {
    const hearts = renderHearts({ ...DEFAULT, absorption: 4 });
    expect(hearts.some((h) => h.kind === 'absorption_full')).toBe(true);
  });

  it('hunger full = 10', () => {
    const h = renderHunger(DEFAULT);
    expect(h.filter((i) => i.kind === 'full').length).toBe(10);
  });

  it('bubbles: full air = 0 icons', () => {
    expect(renderBubbles(DEFAULT)).toBe(0);
  });

  it('bubbles scale with breath', () => {
    const b = renderBubbles({ ...DEFAULT, breathSec: 7.5 });
    expect(b).toBe(5);
  });

  it('xp bar clamps', () => {
    expect(xpBarFraction({ ...DEFAULT, xpProgress: 1.5 })).toBe(1);
    expect(xpBarFraction({ ...DEFAULT, xpProgress: -0.1 })).toBe(0);
  });

  it('damage tint fades', () => {
    expect(damageTintAlpha(0)).toBe(1);
    expect(damageTintAlpha(0.25)).toBeCloseTo(0.5);
    expect(damageTintAlpha(1)).toBe(0);
  });
});
