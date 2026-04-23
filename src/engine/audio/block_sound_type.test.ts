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
});
