import { describe, it, expect } from 'vitest';
import { pitchCycle, instrumentForBelow, NOTES } from './noteblock_pitch';

describe('noteblock pitch', () => {
  it('increments', () => {
    expect(pitchCycle(0)).toBe(1);
  });

  it('wraps', () => {
    expect(pitchCycle(NOTES - 1)).toBe(0);
  });

  it('wool guitar', () => {
    expect(instrumentForBelow('wool')).toBe('guitar');
  });

  it('stone basedrum', () => {
    expect(instrumentForBelow('stone')).toBe('basedrum');
  });

  it('default harp', () => {
    expect(instrumentForBelow('air')).toBe('harp');
  });

  it('glowstone pling', () => {
    expect(instrumentForBelow('glowstone')).toBe('pling');
  });

  it('concrete_powder + heavy_core snare (wiki)', () => {
    // Wiki (minecraft.wiki/w/Note_Block): snare list includes
    // sand, gravel, concrete_powder, heavy_core.
    expect(instrumentForBelow('white_concrete_powder')).toBe('snare');
    expect(instrumentForBelow('heavy_core')).toBe('snare');
  });

  it('wood-family bass (wiki list)', () => {
    // Wiki: chest/bookshelf/jukebox/crafting_table/banner/etc. all bass.
    expect(instrumentForBelow('chest')).toBe('bass');
    expect(instrumentForBelow('bookshelf')).toBe('bass');
    expect(instrumentForBelow('jukebox')).toBe('bass');
    expect(instrumentForBelow('crafting_table')).toBe('bass');
    expect(instrumentForBelow('white_banner')).toBe('bass');
    expect(instrumentForBelow('beehive')).toBe('bass');
  });

  it('copper trumpet (1.21 winter drop)', () => {
    expect(instrumentForBelow('copper_block')).toBe('trumpet');
    expect(instrumentForBelow('cut_copper')).toBe('trumpet');
    expect(instrumentForBelow('chiseled_copper')).toBe('trumpet');
    expect(instrumentForBelow('weathered_copper')).toBe('trumpet');
  });

  it('ores are basedrum, not bell/iron_xylophone/bit (wiki)', () => {
    // Wiki: only block-of-X is the special tone; ores fall through
    // to basedrum like other stone-family blocks.
    expect(instrumentForBelow('gold_ore')).toBe('basedrum');
    expect(instrumentForBelow('iron_ore')).toBe('basedrum');
    expect(instrumentForBelow('emerald_ore')).toBe('basedrum');
  });

  it('plain ice is harp; only packed_ice is chime (wiki)', () => {
    expect(instrumentForBelow('packed_ice')).toBe('chime');
    expect(instrumentForBelow('ice')).toBe('harp');
    expect(instrumentForBelow('blue_ice')).toBe('harp');
  });
});
