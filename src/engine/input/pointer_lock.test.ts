import { describe, it, expect } from 'vitest';
import { initState, onRawDelta, consume, onLockChange, clampPitch } from './pointer_lock';

describe('pointer lock', () => {
  it('ignores deltas when unlocked', () => {
    const s = initState();
    onRawDelta(s, 10, 10);
    expect(consume(s).yawDelta).toBe(0);
  });

  it('accumulates deltas when locked', () => {
    const s = initState();
    onLockChange(s, true);
    onRawDelta(s, 100, 0);
    const r = consume(s);
    expect(r.yawDelta).toBeGreaterThan(0);
  });

  it('consume zeros state', () => {
    const s = initState();
    onLockChange(s, true);
    onRawDelta(s, 50, 0);
    consume(s);
    expect(s.dx).toBe(0);
  });

  it('invertY flips pitch', () => {
    const s = initState();
    s.invertY = true;
    onLockChange(s, true);
    onRawDelta(s, 0, 100);
    expect(consume(s).pitchDelta).toBeGreaterThan(0);
  });

  it('pitch clamped', () => {
    expect(clampPitch(Math.PI)).toBeLessThan(Math.PI / 2);
    expect(clampPitch(-Math.PI)).toBeGreaterThan(-Math.PI / 2);
  });
});
