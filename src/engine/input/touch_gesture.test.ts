import { describe, it, expect } from 'vitest';
import { TouchGestureRecognizer } from './touch_gesture';

describe('touch gestures', () => {
  it('quick down→up = tap', () => {
    const g = new TouchGestureRecognizer();
    g.onDown({ id: 1, x: 10, y: 10, tsMs: 0 });
    const r = g.onUp(1, 100);
    expect(r?.kind).toBe('tap');
  });

  it('long press', () => {
    const g = new TouchGestureRecognizer();
    g.onDown({ id: 1, x: 10, y: 10, tsMs: 0 });
    const r = g.onUp(1, 600);
    expect(r?.kind).toBe('long_press');
  });

  it('pan during drag', () => {
    const g = new TouchGestureRecognizer();
    g.onDown({ id: 1, x: 10, y: 10, tsMs: 0 });
    const r = g.onMove({ id: 1, x: 30, y: 10, tsMs: 50 });
    expect(r?.kind).toBe('pan');
    if (r?.kind === 'pan') expect(r.dx).toBe(20);
  });

  it('pinch scales with distance', () => {
    const g = new TouchGestureRecognizer();
    g.onDown({ id: 1, x: 0, y: 0, tsMs: 0 });
    g.onDown({ id: 2, x: 100, y: 0, tsMs: 0 });
    const r = g.onMove({ id: 2, x: 200, y: 0, tsMs: 50 });
    expect(r?.kind).toBe('pinch');
    if (r?.kind === 'pinch') expect(r.scale).toBeGreaterThan(1);
  });

  it('reset clears state', () => {
    const g = new TouchGestureRecognizer();
    g.onDown({ id: 1, x: 10, y: 10, tsMs: 0 });
    g.reset();
    expect(g.onUp(1, 100)).toBeNull();
  });

  it('move on unknown touch = null', () => {
    const g = new TouchGestureRecognizer();
    expect(g.onMove({ id: 99, x: 10, y: 10, tsMs: 0 })).toBeNull();
  });
});
