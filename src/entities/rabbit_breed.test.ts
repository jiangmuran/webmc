import { describe, it, expect } from 'vitest';
import { accepts, childVariant, RABBIT_BABY_GROW_TICKS } from './rabbit_breed';

describe('rabbit breed', () => {
  it('accepts dandelion', () => {
    expect(accepts('dandelion')).toBe(true);
  });

  it('accepts carrot', () => {
    expect(accepts('carrot')).toBe(true);
  });

  it('rejects apple', () => {
    expect(accepts('apple')).toBe(false);
  });

  it('child inherits from a at low roll', () => {
    expect(childVariant('gold', 'white', 'brown', () => 0.2)).toBe('gold');
  });

  it('child inherits from b at high roll', () => {
    expect(childVariant('gold', 'white', 'brown', () => 0.9)).toBe('white');
  });

  it('biome fallback at tiny roll', () => {
    expect(childVariant('gold', 'white', 'brown', () => 0)).toBe('brown');
  });

  it('grow time 20 min', () => {
    expect(RABBIT_BABY_GROW_TICKS).toBe(24000);
  });
});
