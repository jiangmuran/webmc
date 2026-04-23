import { describe, it, expect } from 'vitest';
import { defaultKeybinds, setBind, actionForCode, hasConflict } from './keybind_registry';

describe('keybind registry', () => {
  it('defaults include movement', () => {
    const k = defaultKeybinds();
    expect(k.map.forward).toBe('KeyW');
    expect(k.map.jump).toBe('Space');
  });

  it('setBind updates', () => {
    const k = setBind(defaultKeybinds(), 'forward', 'ArrowUp');
    expect(k.map.forward).toBe('ArrowUp');
  });

  it('setBind returns new', () => {
    const a = defaultKeybinds();
    const b = setBind(a, 'forward', 'ArrowUp');
    expect(a.map.forward).toBe('KeyW');
    expect(b.map.forward).toBe('ArrowUp');
  });

  it('action lookup', () => {
    const k = defaultKeybinds();
    expect(actionForCode(k, 'Space')).toBe('jump');
    expect(actionForCode(k, 'KeyZ')).toBeNull();
  });

  it('detects conflict', () => {
    const k = setBind(defaultKeybinds(), 'sprint', 'KeyW');
    const conflicts = hasConflict(k);
    expect(conflicts.length).toBeGreaterThan(0);
  });

  it('no conflict in defaults', () => {
    expect(hasConflict(defaultKeybinds()).length).toBe(0);
  });
});
