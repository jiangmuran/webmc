import { describe, it, expect } from 'vitest';
import { emitRate, particlesPerSecond, MAX_DRAW_DISTANCE } from './particle_emit_rate';

describe('particle emit rate', () => {
  it('close strong', () => {
    expect(emitRate({ source: 'torch', intensity: 1, distanceFromCamera: 1 })).toBeGreaterThan(0.9);
  });

  it('far zero', () => {
    expect(
      emitRate({ source: 'torch', intensity: 1, distanceFromCamera: MAX_DRAW_DISTANCE + 1 }),
    ).toBe(0);
  });

  it('rate x20 per sec', () => {
    const r = emitRate({ source: 'torch', intensity: 1, distanceFromCamera: 0 });
    expect(particlesPerSecond({ source: 'torch', intensity: 1, distanceFromCamera: 0 })).toBe(r * 20);
  });
});
