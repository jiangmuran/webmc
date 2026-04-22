import { describe, it, expect } from 'vitest';
import { makeShake, addShake, tickShake, shakeOffset, SHAKE_AMPLITUDE } from './screen_shake';

describe('screen shake', () => {
  it('add increases amplitude', () => {
    const s = makeShake();
    addShake(s, 5);
    expect(s.currentAmplitude).toBe(5);
  });

  it('tick decays', () => {
    const s = makeShake();
    addShake(s, 5);
    tickShake(s, 1);
    expect(s.currentAmplitude).toBeLessThan(5);
  });

  it('no negative', () => {
    const s = makeShake();
    addShake(s, 1);
    tickShake(s, 100);
    expect(s.currentAmplitude).toBe(0);
  });

  it('offset zero when calm', () => {
    const s = makeShake();
    const o = shakeOffset(s, 1000);
    expect(o).toEqual({ x: 0, y: 0 });
  });

  it('offset nonzero while shaking', () => {
    const s = makeShake();
    addShake(s, 5);
    const o = shakeOffset(s, 1000);
    expect(Math.abs(o.x) + Math.abs(o.y)).toBeGreaterThan(0);
  });

  it('amplitude table', () => {
    expect(SHAKE_AMPLITUDE['warden_sonic']).toBeGreaterThan(SHAKE_AMPLITUDE['tnt'] ?? 0);
  });
});
