import { describe, it, expect } from 'vitest';
import { actionForButton, isPressed } from './gamepad_button_map';

describe('gamepad button map', () => {
  it('button 0 jumps', () => {
    expect(actionForButton(0)).toBe('jump');
  });

  it('unmapped undefined', () => {
    expect(actionForButton(99)).toBeUndefined();
  });

  it('rising edge detected', () => {
    expect(isPressed(false, true)).toBe(true);
    expect(isPressed(true, true)).toBe(false);
    expect(isPressed(false, false)).toBe(false);
  });
});
