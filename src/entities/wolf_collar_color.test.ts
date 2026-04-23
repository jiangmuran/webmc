import { describe, it, expect } from 'vitest';
import { collarColor, changesOnDye, DEFAULT_COLLAR } from './wolf_collar_color';

describe('wolf collar color', () => {
  it('default red', () => {
    expect(collarColor()).toBe(DEFAULT_COLLAR);
  });

  it('applied color wins', () => {
    expect(collarColor('blue')).toBe('blue');
  });

  it('dye changes', () => {
    expect(changesOnDye('green')).toBe('green');
  });
});
