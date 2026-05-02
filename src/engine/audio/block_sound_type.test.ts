import { describe, it, expect } from 'vitest';
import { soundsFor, groupFor } from './block_sound_type';

describe('block sound type', () => {
  it('oak_log is wood', () => {
    expect(groupFor('oak_log')).toBe('wood');
  });

  it('stone is stone', () => {
    expect(groupFor('stone')).toBe('stone');
  });

  it('grass block is grass', () => {
    expect(groupFor('grass_block')).toBe('grass');
  });

  it('iron block is metal', () => {
    expect(groupFor('iron_block')).toBe('metal');
  });

  it('sounds ids format', () => {
    const s = soundsFor('wood');
    expect(s.place).toContain('wood');
    expect(s.step).toContain('wood');
  });

  it('wool blocks (webmc + Java naming) are wool sound group', () => {
    // Project blocks/registry.ts uses `wool_<color>`; also accept
    // the Java-edition `<color>_wool` for save-import compatibility.
    expect(groupFor('wool_red')).toBe('wool');
    expect(groupFor('wool_white')).toBe('wool');
    expect(groupFor('white_wool')).toBe('wool');
  });
});
