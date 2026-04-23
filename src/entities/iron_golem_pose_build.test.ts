import { describe, it, expect } from 'vitest';
import { isValidPose, alsoAcceptsJackOLantern } from './iron_golem_pose_build';

describe('iron golem pose build', () => {
  const valid = {
    centerBlock: 'iron_block',
    arms: ['iron_block', 'iron_block'] as [string, string],
    legs: 'iron_block',
    headAboveCenter: 'carved_pumpkin',
  };

  it('valid pose', () => {
    expect(isValidPose(valid)).toBe(true);
  });

  it('missing arm fails', () => {
    expect(isValidPose({ ...valid, arms: ['iron_block', 'gold_block'] })).toBe(false);
  });

  it('jack o lantern head OK', () => {
    expect(isValidPose({ ...valid, headAboveCenter: 'jack_o_lantern' })).toBe(true);
  });

  it('plain pumpkin rejected', () => {
    expect(isValidPose({ ...valid, headAboveCenter: 'pumpkin' })).toBe(false);
  });

  it('accepts lit head', () => {
    expect(alsoAcceptsJackOLantern()).toBe(true);
  });
});
