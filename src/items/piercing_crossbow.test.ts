import { describe, it, expect } from 'vitest';
import { initArrow, onHit, maxPierces, incompatibleWith } from './piercing_crossbow';

describe('piercing crossbow', () => {
  it('level 0 no pierces', () => {
    expect(maxPierces(0)).toBe(0);
  });

  it('max clamps 4', () => {
    expect(maxPierces(10)).toBe(4);
  });

  it('piercing passes through first hit', () => {
    const a = initArrow(2);
    const r = onHit(a, 'e1');
    expect(r.damaged).toBe(true);
    expect(r.removed).toBe(false);
  });

  it('removed after piercing runs out', () => {
    const a = initArrow(1);
    onHit(a, 'e1');
    const r = onHit(a, 'e2');
    expect(r.removed).toBe(true);
  });

  it('ignores duplicate entity hits', () => {
    const a = initArrow(3);
    onHit(a, 'e1');
    expect(onHit(a, 'e1').damaged).toBe(false);
  });

  it('incompat multishot', () => {
    expect(incompatibleWith()).toContain('multishot');
  });
});
