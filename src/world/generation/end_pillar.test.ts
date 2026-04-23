import { describe, it, expect } from 'vitest';
import { pillarAt, pillarsCaged, pillarAngle, PILLAR_COUNT } from './end_pillar';

describe('end pillar', () => {
  it('10 pillars', () => {
    expect(PILLAR_COUNT).toBe(10);
  });

  it('pillar has positive dimensions', () => {
    const p = pillarAt(0);
    expect(p.radius).toBeGreaterThan(0);
    expect(p.height).toBeGreaterThan(50);
  });

  it('half caged', () => {
    expect(pillarsCaged()).toBe(5);
  });

  it('angles distributed', () => {
    expect(pillarAngle(0)).toBe(0);
    expect(pillarAngle(PILLAR_COUNT)).toBeCloseTo(2 * Math.PI);
  });
});
