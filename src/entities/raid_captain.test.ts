import { describe, it, expect } from 'vitest';
import { makeCaptain, onCaptainKilled, removeBanner } from './raid_captain';

describe('raid captain', () => {
  it('banner captain drops bad omen on kill', () => {
    const c = makeCaptain(2);
    const r = onCaptainKilled(c);
    expect(r.appliesBadOmen).toBe(true);
    expect(r.badOmenLevel).toBe(2);
  });

  it('no banner = no omen', () => {
    const c = makeCaptain(1);
    removeBanner(c);
    expect(onCaptainKilled(c).appliesBadOmen).toBe(false);
  });

  it('bannerTier clamps 1..5', () => {
    expect(makeCaptain(10).bannerTier).toBe(5);
    expect(makeCaptain(0).bannerTier).toBe(1);
  });
});
