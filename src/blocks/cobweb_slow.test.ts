import { describe, it, expect } from 'vitest';
import { speedMultiplier, fallDamageInCobweb, cobwebDrop, COBWEB_SPEED_MULT } from './cobweb_slow';

describe('cobweb', () => {
  it('slows entity', () => {
    expect(speedMultiplier({ inCobweb: true })).toBe(COBWEB_SPEED_MULT);
  });

  it('outside full speed', () => {
    expect(speedMultiplier({ inCobweb: false })).toBe(1);
  });

  it('fall damage canceled', () => {
    expect(fallDamageInCobweb({ inCobweb: true }, 10)).toBe(0);
  });

  it('fall damage passes outside', () => {
    expect(fallDamageInCobweb({ inCobweb: false }, 10)).toBe(10);
  });

  it('drop tool', () => {
    expect(cobwebDrop('shears')).toBe('webmc:string');
    expect(cobwebDrop('hand')).toBeNull();
  });
});
