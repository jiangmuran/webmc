import { describe, it, expect } from 'vitest';
import { start, tick, release, cancel, progress01 } from './eat_animation_timer';

describe('eat animation timer', () => {
  it('early release no consume', () => {
    let s = start('apple');
    for (let i = 0; i < 10; i++) s = tick(s);
    const r = release(s);
    expect(r.consumed).toBe(false);
  });

  it('full hold consumes', () => {
    let s = start('apple');
    for (let i = 0; i < 32; i++) s = tick(s);
    expect(release(s).consumed).toBe(true);
  });

  it('cancel freezes', () => {
    let s = cancel(tick(start('apple')));
    s = tick(s);
    expect(s.ticksHeld).toBe(1);
  });

  it('progress 0..1', () => {
    let s = start('apple');
    for (let i = 0; i < 16; i++) s = tick(s);
    expect(progress01(s)).toBeCloseTo(0.5);
  });
});
