import { describe, it, expect } from 'vitest';
import { interpret } from './quick_move_hotkey';

describe('quick move hotkey', () => {
  it('digit swaps hotbar slot', () => {
    expect(interpret('Digit3', { ctrl: false })).toEqual({ kind: 'swap_hotbar', hotbarIndex: 2 });
  });

  it('F → offhand', () => {
    expect(interpret('KeyF', { ctrl: false })).toEqual({ kind: 'swap_offhand' });
  });

  it('Q drops single', () => {
    expect(interpret('KeyQ', { ctrl: false })).toEqual({ kind: 'drop_hovered', wholeStack: false });
  });

  it('Ctrl+Q drops stack', () => {
    expect(interpret('KeyQ', { ctrl: true })).toEqual({ kind: 'drop_hovered', wholeStack: true });
  });

  it('Ctrl+A pickup', () => {
    expect(interpret('KeyA', { ctrl: true })).toEqual({ kind: 'pickup_whole_stack' });
  });

  it('unknown key ignored', () => {
    expect(interpret('KeyZ', { ctrl: false })).toEqual({ kind: 'ignore' });
  });
});
