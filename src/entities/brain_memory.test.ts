import { describe, it, expect } from 'vitest';
import { makeBrain, set, get, forget, has } from './brain_memory';

describe('brain memory', () => {
  it('set + get', () => {
    const b = makeBrain();
    set(b, 'home', { x: 0, y: 64, z: 0 });
    expect((get(b, 'home', 0) as { x: number } | undefined)?.x).toBe(0);
  });

  it('expiry removes', () => {
    const b = makeBrain();
    set(b, 'target', 'zombie', 100);
    expect(get(b, 'target', 50)).toBe('zombie');
    expect(get(b, 'target', 200)).toBeUndefined();
  });

  it('forget clears', () => {
    const b = makeBrain();
    set(b, 'k', 1);
    forget(b, 'k');
    expect(has(b, 'k', 0)).toBe(false);
  });

  it('missing key undefined', () => {
    expect(get(makeBrain(), 'missing', 0)).toBeUndefined();
  });

  it('never-expiring lives on', () => {
    const b = makeBrain();
    set(b, 'k', 'v');
    expect(get(b, 'k', 1e9)).toBe('v');
  });
});
