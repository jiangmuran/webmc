import { describe, it, expect } from 'vitest';
import { instrumentForBlockBelow, notePitch } from './note_block_instrument';

describe('note block instrument', () => {
  // Wiki (minecraft.wiki/w/Note_Block): real game block names are
  // oak_planks / oak_log / oak_wood / etc. — there is no bare "wood"
  // block. Use canonical names so behavior matches real placements.
  it('oak_planks = bass', () => {
    expect(instrumentForBlockBelow('oak_planks')).toBe('bass');
  });

  it('default harp', () => {
    expect(instrumentForBlockBelow('grass_block')).toBe('harp');
  });

  it('pitch doubles per octave', () => {
    expect(notePitch(24)).toBeCloseTo(notePitch(12) * 2);
  });

  it('pitch clamps', () => {
    expect(notePitch(100)).toBe(notePitch(24));
    expect(notePitch(-5)).toBe(notePitch(0));
  });
});
