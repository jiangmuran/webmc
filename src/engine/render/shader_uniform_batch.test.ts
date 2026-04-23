import { describe, it, expect } from 'vitest';
import { apply, clear, diffCount } from './shader_uniform_batch';

describe('shader uniform batch', () => {
  it('apply adds', () => {
    const b = apply(clear(), { name: 'time', value: 10 });
    expect(b.uniforms['time']).toBe(10);
  });

  it('redundant apply no change', () => {
    const b = apply(clear(), { name: 'time', value: 10 });
    const b2 = apply(b, { name: 'time', value: 10 });
    expect(b).toBe(b2);
  });

  it('diff counts', () => {
    const prev = apply(clear(), { name: 'a', value: 1 });
    const next = apply(apply(prev, { name: 'a', value: 2 }), { name: 'b', value: 3 });
    expect(diffCount(prev, next)).toBe(2);
  });
});
