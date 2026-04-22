import { describe, it, expect } from 'vitest';
import {
  canInterrupt,
  interrupt,
  makeSleepAnim,
  sleepFadeAmount,
  startSleep,
  tickSleepAnim,
} from './time_skip_animation';

describe('sleep animation', () => {
  it('awake = no fade', () => {
    const s = makeSleepAnim();
    expect(sleepFadeAmount(s)).toBe(0);
  });

  it('initiating fades in', () => {
    const s = makeSleepAnim();
    startSleep(s);
    tickSleepAnim(s, 0.25);
    expect(sleepFadeAmount(s)).toBeCloseTo(0.5);
  });

  it('sleep completes time skip', () => {
    const s = makeSleepAnim();
    startSleep(s);
    tickSleepAnim(s, 0.5); // → sleeping
    const r = tickSleepAnim(s, 2.5);
    expect(r.skippedTime).toBe(true);
  });

  it('wakes up fully', () => {
    const s = makeSleepAnim();
    startSleep(s);
    tickSleepAnim(s, 10); // → sleeping
    tickSleepAnim(s, 10); // → awakening
    tickSleepAnim(s, 10); // → awake
    expect(s.phase).toBe('awake');
  });

  it('can interrupt mid-sleep', () => {
    const s = makeSleepAnim();
    startSleep(s);
    expect(canInterrupt(s)).toBe(true);
    interrupt(s);
    expect(s.phase).toBe('awakening');
  });

  it('awake cannot be interrupted', () => {
    const s = makeSleepAnim();
    expect(canInterrupt(s)).toBe(false);
  });
});
