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

  it('lightning fully resets copper oxidation (wiki: removes ALL)', () => {
    // Wiki: "A lightning bolt striking a non-waxed copper block removes
    // all oxidation from the block." Not just one stage back.
    expect(onCopperStrike('webmc:oxidized_copper')).toBe('webmc:copper_block');
    expect(onCopperStrike('webmc:weathered_copper')).toBe('webmc:copper_block');
    expect(onCopperStrike('webmc:exposed_copper')).toBe('webmc:copper_block');
    // Already un-oxidized: no change reported.
    expect(onCopperStrike('webmc:copper_block')).toBeNull();
  });

  it('sand no effect', () => {
    expect(sandStrikeEffect()).toBeNull();
  });

  it('side effect radius', () => {
    expect(SIDE_EFFECT_RADIUS).toBeGreaterThan(0);
  });
});
