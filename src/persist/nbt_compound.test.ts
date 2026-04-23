import { describe, it, expect } from 'vitest';
import { getByte, getString, setInt, shallowMerge } from './nbt_compound';

describe('nbt compound', () => {
  it('reads byte', () => {
    expect(getByte({ x: { type: 'byte', value: 7 } }, 'x')).toBe(7);
  });

  it('type mismatch undefined', () => {
    expect(getByte({ x: { type: 'int', value: 7 } }, 'x')).toBeUndefined();
  });

  it('reads string', () => {
    expect(getString({ s: { type: 'string', value: 'hi' } }, 's')).toBe('hi');
  });

  it('set int', () => {
    const c = setInt({}, 'n', 5);
    expect(c['n']).toEqual({ type: 'int', value: 5 });
  });

  it('merge', () => {
    const m = shallowMerge({ a: { type: 'int', value: 1 } }, { b: { type: 'int', value: 2 } });
    expect(Object.keys(m)).toHaveLength(2);
  });
});
