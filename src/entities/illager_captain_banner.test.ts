import { describe, it, expect } from 'vitest';
import { isRaidCaptain, killGrantsOmen, omenLevelFromKill } from './illager_captain_banner';

describe('illager captain banner', () => {
  it('pillager with banner is captain', () => {
    expect(isRaidCaptain({ type: 'pillager', hasBannerOnHead: true })).toBe(true);
  });

  it('evoker cannot be captain', () => {
    expect(isRaidCaptain({ type: 'evoker', hasBannerOnHead: true })).toBe(false);
  });

  it('no banner no captain', () => {
    expect(isRaidCaptain({ type: 'pillager', hasBannerOnHead: false })).toBe(false);
  });

  it('kill grants omen', () => {
    expect(killGrantsOmen({ type: 'pillager', hasBannerOnHead: true })).toBe(true);
    expect(omenLevelFromKill()).toBe(1);
  });
});
