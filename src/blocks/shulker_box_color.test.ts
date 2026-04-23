import { describe, it, expect } from 'vitest';
import { dyedName, redye, undye } from './shulker_box_color';

describe('shulker box color', () => {
  it('dyed name', () => {
    expect(dyedName('red')).toBe('red_shulker_box');
  });

  it('redye replaces', () => {
    expect(redye('white_shulker_box', 'blue')).toBe('blue_shulker_box');
  });

  it('redye no-op for non-shulker', () => {
    expect(redye('stone', 'blue')).toBe('stone');
  });

  it('undye returns plain', () => {
    expect(undye('red_shulker_box')).toBe('shulker_box');
  });
});
