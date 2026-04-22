import { describe, it, expect } from 'vitest';
import {
  makeMouseCaptureState,
  onPointerLockChange,
  releaseCapture,
  requestCapture,
  shouldApplyMouseToCamera,
} from './mouse_capture';

describe('mouse capture', () => {
  it('initial uncaptured', () => {
    const s = makeMouseCaptureState();
    expect(shouldApplyMouseToCamera(s)).toBe(false);
  });

  it('requestCapture captures', () => {
    const s = makeMouseCaptureState();
    const r = requestCapture(s, { nowMs: 0, uiOpen: false, tabHasFocus: true });
    expect(r.allowed).toBe(true);
    expect(shouldApplyMouseToCamera(s)).toBe(true);
  });

  it('UI open blocks capture', () => {
    const s = makeMouseCaptureState();
    const r = requestCapture(s, { nowMs: 0, uiOpen: true, tabHasFocus: true });
    expect(r.reason).toBe('ui_open');
  });

  it('blurred tab blocks', () => {
    const s = makeMouseCaptureState();
    const r = requestCapture(s, { nowMs: 0, uiOpen: false, tabHasFocus: false });
    expect(r.reason).toBe('tab_blurred');
  });

  it('cooldown throttles repeat requests', () => {
    const s = makeMouseCaptureState();
    requestCapture(s, { nowMs: 0, uiOpen: false, tabHasFocus: true });
    const r = requestCapture(s, { nowMs: 100, uiOpen: false, tabHasFocus: true });
    expect(r.reason).toBe('recent_request');
  });

  it('release clears state', () => {
    const s = makeMouseCaptureState();
    requestCapture(s, { nowMs: 0, uiOpen: false, tabHasFocus: true });
    releaseCapture(s);
    expect(shouldApplyMouseToCamera(s)).toBe(false);
  });

  it('pointerLockChange mirrors', () => {
    const s = makeMouseCaptureState();
    onPointerLockChange(s, true);
    expect(s.state).toBe('captured');
    onPointerLockChange(s, false);
    expect(s.state).toBe('uncaptured');
  });
});
