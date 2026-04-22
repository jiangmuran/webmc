import { describe, it, expect } from 'vitest';
import { KeyBindings } from './keybind_rebind';

describe('keybind', () => {
  it('defaults', () => {
    const b = new KeyBindings();
    expect(b.get('forward')).toBe('KeyW');
  });

  it('rebind', () => {
    const b = new KeyBindings();
    b.set('forward', 'ArrowUp');
    expect(b.get('forward')).toBe('ArrowUp');
  });

  it('reset', () => {
    const b = new KeyBindings();
    b.set('jump', 'KeyJ');
    b.reset();
    expect(b.get('jump')).toBe('Space');
  });

  it('conflicts', () => {
    const b = new KeyBindings();
    b.set('sprint', 'KeyW'); // conflict with forward
    const c = b.conflicts();
    expect(c.length).toBe(1);
    expect(c[0]?.sort()).toEqual(['forward', 'sprint']);
  });

  it('actionForKey', () => {
    const b = new KeyBindings();
    expect(b.actionForKey('KeyE')).toEqual(['inventory']);
  });
});
