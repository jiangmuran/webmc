import { describe, it, expect } from 'vitest';
import {
  ignitesBlock,
  onCopperStrike,
  sandStrikeEffect,
  SIDE_EFFECT_RADIUS,
} from './lightning_damage_blocks';

describe('lightning blocks', () => {
  it('ignites flammables', () => {
    expect(ignitesBlock({ groundBlockId: 'webmc:hay_block', rand: () => 0 })).toBe(true);
    expect(ignitesBlock({ groundBlockId: 'webmc:stone', rand: () => 0 })).toBe(false);
  });

  it('copper de-oxidize', () => {
    expect(onCopperStrike('webmc:oxidized_copper')).toBe('webmc:weathered_copper');
    expect(onCopperStrike('webmc:copper_block')).toBeNull();
  });

  it('sand no effect', () => {
    expect(sandStrikeEffect()).toBeNull();
  });

  it('side effect radius', () => {
    expect(SIDE_EFFECT_RADIUS).toBeGreaterThan(0);
  });
});
