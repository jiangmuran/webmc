import { describe, it, expect } from 'vitest';
import { BED_COLORS, bedBlockId, craftBed, dyeBed, parseBedId } from './bed_color';

describe('bed colors', () => {
  it('16 colors', () => {
    expect(BED_COLORS.length).toBe(16);
  });

  it('bedBlockId round-trips via parseBedId', () => {
    const id = bedBlockId('cyan');
    expect(parseBedId(id)).toBe('cyan');
  });

  it('parseBedId returns null for invalid', () => {
    expect(parseBedId('webmc:not_a_bed')).toBeNull();
    expect(parseBedId('webmc:purple_chair')).toBeNull();
  });

  it('craft bed needs 3 wool + 3 planks', () => {
    expect(craftBed({ woolColor: 'red', woolCount: 3, plankCount: 3 })?.item).toBe('webmc:red_bed');
    expect(craftBed({ woolColor: 'red', woolCount: 2, plankCount: 3 })).toBeNull();
  });

  it('dyeBed same color = no change', () => {
    expect(dyeBed({ currentColor: 'blue', newColor: 'blue' }).changed).toBe(false);
  });

  it('dyeBed swaps', () => {
    const r = dyeBed({ currentColor: 'red', newColor: 'blue' });
    expect(r.changed).toBe(true);
    expect(r.newBlockId).toBe('webmc:blue_bed');
  });
});
