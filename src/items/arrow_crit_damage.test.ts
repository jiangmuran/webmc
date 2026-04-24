import { describe, it, expect } from 'vitest';
import { drawFraction, isCritical, arrowDamage } from './arrow_crit_damage';

const full = { drawTicks: 20, maxDrawTicks: 20, powerLevel: 0 };

describe('arrow crit damage', () => {
  it('full draw → critical', () => {
    expect(isCritical(full)).toBe(true);
  });

  it('half draw not critical', () => {
    expect(isCritical({ ...full, drawTicks: 10 })).toBe(false);
  });

  it('draw fraction capped at 1', () => {
    expect(drawFraction({ ...full, drawTicks: 100 })).toBe(1);
  });

  it('no-draw minimal damage', () => {
    expect(arrowDamage({ ...full, drawTicks: 0 })).toBe(0);
  });

  it('full-draw damages', () => {
    expect(arrowDamage(full)).toBeGreaterThan(0);
  });

  it('power enchant boosts', () => {
    const plain = arrowDamage(full);
    const power = arrowDamage({ ...full, powerLevel: 3 });
    expect(power).toBeGreaterThan(plain);
  });
});
