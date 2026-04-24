import { describe, it, expect } from 'vitest';
import {
  canDuplicate,
  dropsHeldOnDuplicate,
  pickupMatches,
  DUPE_COOLDOWN_TICKS,
} from './allay_duplicate_amethyst';

describe('allay duplicate amethyst', () => {
  it('needs amethyst', () => {
    expect(
      canDuplicate({
        ticksSinceDupe: DUPE_COOLDOWN_TICKS,
        hasAmethystHeld: false,
        nearDancingJukebox: true,
      }),
    ).toBe(false);
  });

  it('needs dancing jukebox', () => {
    expect(
      canDuplicate({
        ticksSinceDupe: DUPE_COOLDOWN_TICKS,
        hasAmethystHeld: true,
        nearDancingJukebox: false,
      }),
    ).toBe(false);
  });

  it('cooldown blocks', () => {
    expect(
      canDuplicate({
        ticksSinceDupe: 10,
        hasAmethystHeld: true,
        nearDancingJukebox: true,
      }),
    ).toBe(false);
  });

  it('all conditions met duplicates', () => {
    expect(
      canDuplicate({
        ticksSinceDupe: DUPE_COOLDOWN_TICKS,
        hasAmethystHeld: true,
        nearDancingJukebox: true,
      }),
    ).toBe(true);
  });

  it('drop item on dupe', () => {
    expect(
      dropsHeldOnDuplicate({
        ticksSinceDupe: DUPE_COOLDOWN_TICKS,
        hasAmethystHeld: true,
        nearDancingJukebox: true,
      }),
    ).toBe(true);
  });

  it('pickup matches held', () => {
    expect(pickupMatches('feather', 'feather')).toBe(true);
    expect(pickupMatches('feather', 'stick')).toBe(false);
  });
});
