import { describe, it, expect } from 'vitest';
import { pressureLevel, targetCachedChunks, shouldForceGc } from './memory_pressure';

describe('memory pressure', () => {
  it('under 75% normal', () => {
    expect(pressureLevel({ heapUsed: 50, heapLimit: 100 })).toBe('normal');
  });

  it('75-90% elevated', () => {
    expect(pressureLevel({ heapUsed: 80, heapLimit: 100 })).toBe('elevated');
  });

  it('over 90% critical', () => {
    expect(pressureLevel({ heapUsed: 95, heapLimit: 100 })).toBe('critical');
  });

  it('cache shrinks under pressure', () => {
    expect(targetCachedChunks('critical', 100)).toBeLessThan(targetCachedChunks('normal', 100));
  });

  it('forceGc only critical', () => {
    expect(shouldForceGc('critical')).toBe(true);
    expect(shouldForceGc('normal')).toBe(false);
  });
});
