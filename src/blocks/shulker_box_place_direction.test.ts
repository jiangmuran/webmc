import { describe, it, expect } from 'vitest';
import {
  placedFacing,
  openAnimationDir,
  preservesContentsOnPick,
} from './shulker_box_place_direction';

describe('shulker box place direction', () => {
  it('faces clicked face', () => {
    expect(placedFacing({ clickedFace: 'up' })).toBe('up');
    expect(placedFacing({ clickedFace: 'east' })).toBe('east');
  });

  it('open animation matches', () => {
    expect(openAnimationDir('up')).toBe('up');
  });

  it('preserves contents', () => {
    expect(preservesContentsOnPick()).toBe(true);
  });
});
