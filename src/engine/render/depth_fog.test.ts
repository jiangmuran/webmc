import { describe, it, expect } from 'vitest';
import { fogFactor, mixColor, fogParamsForDim } from './depth_fog';

describe('depth fog', () => {
  const p = { start: 10, end: 50, color: [1, 1, 1] as [number, number, number] };

  it('before start 0', () => {
    expect(fogFactor(5, p)).toBe(0);
  });

  it('after end 1', () => {
    expect(fogFactor(100, p)).toBe(1);
  });

  it('mid ramp', () => {
    expect(fogFactor(30, p)).toBeCloseTo(0.5);
  });

  it('mix colors', () => {
    expect(mixColor([0, 0, 0], [1, 1, 1], 0.5)).toEqual([0.5, 0.5, 0.5]);
  });

  it('nether fog is thick', () => {
    const n = fogParamsForDim('nether');
    const ow = fogParamsForDim('overworld');
    expect(n.end).toBeLessThan(ow.end);
  });
});
