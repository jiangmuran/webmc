import { describe, it, expect } from 'vitest';
import { soundGroupFor, stepSound, breakSound } from './footstep_block_sound';

describe('footstep/block sound', () => {
  it('oak log is wood', () => {
    expect(soundGroupFor('oak_log')).toBe('wood');
  });

  it('sand group', () => {
    expect(soundGroupFor('sand')).toBe('sand');
  });

  it('sculk', () => {
    expect(soundGroupFor('sculk')).toBe('sculk');
  });

  it('unknown → stone', () => {
    expect(soundGroupFor('unknown')).toBe('stone');
  });

  it('step sound prefixed', () => {
    expect(stepSound('wood')).toContain('step');
  });

  it('break sound prefixed', () => {
    expect(breakSound('sand')).toContain('break');
  });

  it('wool blocks (webmc + Java naming) are wool group', () => {
    // Project naming: `wool_<color>`; Java: `<color>_wool`. Both
    // should resolve to wool sound group.
    expect(soundGroupFor('wool_red')).toBe('wool');
    expect(soundGroupFor('wool')).toBe('wool');
    expect(soundGroupFor('white_wool')).toBe('wool');
  });
});
