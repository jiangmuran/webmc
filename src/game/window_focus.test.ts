import { describe, it, expect } from 'vitest';
import {
  makeFocusState,
  onBlur,
  onFocus,
  onInput,
  onVisibilityChange,
  shouldPause,
} from './window_focus';

describe('window focus', () => {
  it('singleplayer pauses on blur', () => {
    const s = makeFocusState(0);
    onBlur(s, 1);
    const r = shouldPause({ state: s, nowSec: 1, isMultiplayer: false, isSafe: true });
    expect(r.paused).toBe(true);
    expect(r.reason).toBe('window_blur');
  });

  it('multiplayer delays pause', () => {
    const s = makeFocusState(0);
    onBlur(s, 1);
    const r = shouldPause({ state: s, nowSec: 2, isMultiplayer: true, isSafe: true });
    expect(r.paused).toBe(false);
  });

  it('multiplayer pauses after 3s safe', () => {
    const s = makeFocusState(0);
    onBlur(s, 1);
    const r = shouldPause({ state: s, nowSec: 5, isMultiplayer: true, isSafe: true });
    expect(r.paused).toBe(true);
  });

  it('multiplayer unsafe never pauses', () => {
    const s = makeFocusState(0);
    onBlur(s, 1);
    const r = shouldPause({ state: s, nowSec: 30, isMultiplayer: true, isSafe: false });
    expect(r.paused).toBe(false);
  });

  it('idle timeout triggers', () => {
    const s = makeFocusState(0);
    const r = shouldPause({ state: s, nowSec: 1000, isMultiplayer: true, isSafe: true });
    expect(r.paused).toBe(true);
    expect(r.reason).toBe('idle_timeout');
  });

  it('input resets idle', () => {
    const s = makeFocusState(0);
    onInput(s, 500);
    const r = shouldPause({ state: s, nowSec: 600, isMultiplayer: true, isSafe: true });
    expect(r.paused).toBe(false);
  });

  it('focus + visibilityChange mirror', () => {
    const s = makeFocusState(0);
    onVisibilityChange(s, false, 1);
    expect(s.focused).toBe(false);
    onVisibilityChange(s, true, 2);
    expect(s.focused).toBe(true);
  });

  it('onFocus resets input time', () => {
    const s = makeFocusState(0);
    onFocus(s, 500);
    expect(s.lastInputAtSec).toBe(500);
  });
});
