import { describe, it, expect } from 'vitest';
import { minY, maxY, inBounds, inVoid, clamp, isBedrockAt } from './y_level_bounds';

describe('y bounds', () => {
  it('overworld bounds', () => {
    expect(minY('overworld')).toBe(-64);
    expect(maxY('overworld')).toBe(319);
    expect(inBounds('overworld', 100)).toBe(true);
    expect(inBounds('overworld', -100)).toBe(false);
  });

  it('nether bounds', () => {
    expect(maxY('nether')).toBe(127);
    expect(inBounds('nether', 200)).toBe(false);
  });

  it('void detection', () => {
    expect(inVoid('overworld', -80)).toBe(true);
    expect(inVoid('overworld', 0)).toBe(false);
  });

  it('clamp', () => {
    expect(clamp('overworld', -999)).toBe(-64);
    expect(clamp('overworld', 9999)).toBe(319);
  });

  it('bedrock layer', () => {
    const r = () => 0.1;
    expect(isBedrockAt('overworld', -64, r, 0, 0)).toBe(true);
    expect(isBedrockAt('overworld', -61, r, 0, 0)).toBe(true);
    expect(isBedrockAt('overworld', 0, r, 0, 0)).toBe(false);
  });
});
