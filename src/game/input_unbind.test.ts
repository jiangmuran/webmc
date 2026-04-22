import { describe, it, expect } from 'vitest';
import { makeBindings, rebind, unbind, isBound, getBinding } from './input_unbind';

describe('input unbind', () => {
  it('default bound', () => {
    const b = makeBindings({ jump: 'Space' });
    expect(isBound(b, 'jump')).toBe(true);
    expect(getBinding(b, 'jump')).toBe('Space');
  });

  it('rebind', () => {
    const b = makeBindings({ jump: 'Space' });
    rebind(b, 'jump', 'KeyJ');
    expect(getBinding(b, 'jump')).toBe('KeyJ');
  });

  it('unbind', () => {
    const b = makeBindings({ jump: 'Space' });
    unbind(b, 'jump');
    expect(isBound(b, 'jump')).toBe(false);
  });

  it('unassigned null', () => {
    const b = makeBindings();
    expect(getBinding(b, 'chat')).toBeNull();
  });
});
