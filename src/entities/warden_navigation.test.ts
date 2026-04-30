import { describe, it, expect } from 'vitest';
import { phaseFor, moveStep } from './warden_navigation';

describe('warden navigation', () => {
  it('calm at low anger', () => {
    expect(phaseFor({ x: 0, y: 0, z: 0, anger: 0 })).toBe('calm');
  });

  it('investigate at 35 = wiki suspect threshold', () => {
    expect(phaseFor({ x: 0, y: 0, z: 0, anger: 35 })).toBe('investigate');
    expect(phaseFor({ x: 0, y: 0, z: 0, anger: 50 })).toBe('investigate');
    expect(phaseFor({ x: 0, y: 0, z: 0, anger: 34 })).toBe('calm');
  });

  it('attack high', () => {
    expect(phaseFor({ x: 0, y: 0, z: 0, anger: 100 })).toBe('attack');
  });

  it('does not move when calm', () => {
    const w = { x: 0, y: 0, z: 0 };
    const moved = moveStep(w, { x: 10, y: 0, z: 0, anger: 0 }, 1);
    expect(moved).toEqual(w);
  });

  it('attacks fastest', () => {
    const a = moveStep({ x: 0, y: 0, z: 0 }, { x: 10, y: 0, z: 0, anger: 100 }, 1);
    const i = moveStep({ x: 0, y: 0, z: 0 }, { x: 10, y: 0, z: 0, anger: 50 }, 1);
    expect(a.x).toBeGreaterThan(i.x);
  });
});
