import { describe, it, expect } from 'vitest';
import { startPinch, updateFov, MIN_FOV, MAX_FOV } from './touch_pinch_zoom';

describe('touch pinch zoom', () => {
  it('start records baseline', () => {
    const s = startPinch(80, 200);
    expect(s.startFov).toBe(80);
    expect(s.currentFov).toBe(80);
  });

  it('spread reduces FOV (zoom in)', () => {
    const s = startPinch(80, 200);
    const r = updateFov(s, 400);
    expect(r.currentFov).toBeLessThan(80);
  });

  it('pinch closer increases FOV (zoom out)', () => {
    const s = startPinch(80, 200);
    const r = updateFov(s, 100);
    expect(r.currentFov).toBeGreaterThan(80);
  });

  it('clamps to min', () => {
    const s = startPinch(80, 1);
    const r = updateFov(s, 100000);
    expect(r.currentFov).toBe(MIN_FOV);
  });

  it('clamps to max', () => {
    const s = startPinch(80, 10000);
    const r = updateFov(s, 1);
    expect(r.currentFov).toBe(MAX_FOV);
  });

  it('zero start safe', () => {
    const s: Parameters<typeof updateFov>[0] = {
      startDistance: 0,
      startFov: 70,
      currentFov: 70,
    };
    expect(updateFov(s, 100).currentFov).toBe(70);
  });
});
