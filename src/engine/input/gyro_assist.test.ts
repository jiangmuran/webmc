import { describe, it, expect } from 'vitest';
import { init, onSample, setEnabled } from './gyro_assist';

describe('gyro assist', () => {
  it('disabled returns 0 delta', () => {
    const s = init();
    const r = onSample(s, { alpha: 30, beta: 0, gamma: 0 });
    expect(r.yawDelta).toBe(0);
  });

  it('enabled applies gain', () => {
    const s = setEnabled(init(), true);
    const r = onSample(s, { alpha: 10, beta: 0, gamma: 0 });
    expect(r.yawDelta).toBeCloseTo(10 * 0.3);
  });

  it('wraparound near 360', () => {
    let s = setEnabled(init(), true);
    s = onSample(s, { alpha: 350, beta: 0, gamma: 0 }).state;
    const r = onSample(s, { alpha: 5, beta: 0, gamma: 0 });
    expect(r.yawDelta).toBeGreaterThan(0); // +15°, not -345°
    expect(r.yawDelta).toBeLessThan(10);
  });

  it('state persists last yaw', () => {
    const s = setEnabled(init(), true);
    const r = onSample(s, { alpha: 42, beta: 0, gamma: 0 });
    expect(r.state.lastYaw).toBe(42);
  });
});
