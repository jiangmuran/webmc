import { describe, it, expect } from 'vitest';
import { applyDefaults, KeybindRegistry } from './keybind_registry';

describe('keybind registry', () => {
  it('set maps action ↔ key', () => {
    const r = new KeybindRegistry();
    r.set('forward', 'KeyW');
    expect(r.keyFor('forward')).toBe('KeyW');
    expect(r.actionFor('KeyW')).toBe('forward');
  });

  it('rebinding clears prior key', () => {
    const r = new KeybindRegistry();
    r.set('forward', 'KeyW');
    r.set('forward', 'ArrowUp');
    expect(r.actionFor('KeyW')).toBeNull();
  });

  it('key conflict transfers', () => {
    const r = new KeybindRegistry();
    r.set('forward', 'KeyW');
    r.set('jump', 'KeyW');
    expect(r.keyFor('forward')).toBeNull();
    expect(r.keyFor('jump')).toBe('KeyW');
  });

  it('unbind clears', () => {
    const r = new KeybindRegistry();
    r.set('jump', 'Space');
    r.unbind('jump');
    expect(r.keyFor('jump')).toBeNull();
  });

  it('applyDefaults populates', () => {
    const r = new KeybindRegistry();
    applyDefaults(r);
    expect(r.keyFor('forward')).toBe('KeyW');
    expect(r.keyFor('hotbar_5')).toBe('Digit5');
    expect(r.keyFor('attack')).toBe('Mouse0');
  });

  it('allBindings lists all mappings', () => {
    const r = new KeybindRegistry();
    applyDefaults(r);
    const all = r.allBindings();
    expect(all.length).toBeGreaterThan(20);
  });
});
