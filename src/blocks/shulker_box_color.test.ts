import { describe, it, expect } from 'vitest';
import { dyedName, redye } from './shulker_box_color';

describe('shulker box color', () => {
  it('dyed name', () => {
    expect(dyedName('red')).toBe('red_shulker_box');
  });

  it('redye replaces (wiki: undye is NOT supported)', () => {
    // Wiki (minecraft.wiki/w/Shulker_Box): "A dyed shulker box can
    // be re-dyed to a different color." Undyeing back to plain is
    // not supported.
    expect(redye('white_shulker_box', 'blue')).toBe('blue_shulker_box');
    expect(redye('red_shulker_box', 'green')).toBe('green_shulker_box');
  });

  it('redye no-op for non-shulker', () => {
    expect(redye('stone', 'blue')).toBe('stone');
  });
});
