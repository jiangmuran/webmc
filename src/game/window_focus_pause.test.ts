import { describe, it, expect } from 'vitest';
import { makePause, onEvent, worldShouldTick } from './window_focus_pause';

describe('window focus pause', () => {
  it('sp pauses on blur', () => {
    const s = makePause();
    onEvent(s, 'blur');
    expect(s.paused).toBe(true);
    expect(worldShouldTick(s)).toBe(false);
  });

  it('mp does not pause', () => {
    const s = makePause(true);
    onEvent(s, 'blur');
    expect(s.paused).toBe(false);
    expect(worldShouldTick(s)).toBe(true);
  });

  it('focus resumes', () => {
    const s = makePause();
    s.paused = true;
    onEvent(s, 'focus');
    expect(s.paused).toBe(false);
  });

  it('esc toggles', () => {
    const s = makePause();
    onEvent(s, 'esc');
    expect(s.paused).toBe(true);
    onEvent(s, 'esc');
    expect(s.paused).toBe(false);
  });
});
