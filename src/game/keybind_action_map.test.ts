import { describe, it, expect } from 'vitest';
import { defaultBinding, resolveAction, cloneDefaults } from './keybind_action_map';

describe('keybind action map', () => {
  it('jump default space', () => {
    expect(defaultBinding('jump')).toBe('Space');
  });

  it('forward is W', () => {
    expect(defaultBinding('move_forward')).toBe('KeyW');
  });

  it('resolve W to forward', () => {
    expect(resolveAction(cloneDefaults(), 'KeyW')).toBe('move_forward');
  });

  it('unresolved key returns undefined', () => {
    expect(resolveAction(cloneDefaults(), 'KeyZ')).toBeUndefined();
  });

  it('clone is mutable copy', () => {
    const c = cloneDefaults();
    c.jump = 'KeyJ';
    expect(cloneDefaults().jump).toBe('Space');
  });

  it('hotbar 1 is Digit1', () => {
    expect(defaultBinding('hotbar_1')).toBe('Digit1');
  });
});
