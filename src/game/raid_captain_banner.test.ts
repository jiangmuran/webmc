import { describe, it, expect } from 'vitest';
import { badOmenAfterKill, isOminousBanner, BAD_OMEN_MAX_LEVEL } from './raid_captain_banner';

describe('raid captain banner', () => {
  it('player kill grants bad omen', () => {
    const e = badOmenAfterKill({
      killerHadBadOmen: false,
      killerIsPlayer: true,
      currentBadOmenLevel: 0,
    });
    expect(e?.level).toBe(1);
  });

  it('non-player no effect', () => {
    expect(
      badOmenAfterKill({
        killerHadBadOmen: false,
        killerIsPlayer: false,
        currentBadOmenLevel: 0,
      }),
    ).toBeUndefined();
  });

  it('caps at max level', () => {
    const e = badOmenAfterKill({
      killerHadBadOmen: true,
      killerIsPlayer: true,
      currentBadOmenLevel: BAD_OMEN_MAX_LEVEL,
    });
    expect(e?.level).toBe(BAD_OMEN_MAX_LEVEL);
  });

  it('stacks up to max', () => {
    const e = badOmenAfterKill({
      killerHadBadOmen: true,
      killerIsPlayer: true,
      currentBadOmenLevel: 2,
    });
    expect(e?.level).toBe(3);
  });

  it('recognizes ominous banner', () => {
    expect(isOminousBanner('ominous_banner')).toBe(true);
    expect(isOminousBanner('red_banner')).toBe(false);
  });
});
