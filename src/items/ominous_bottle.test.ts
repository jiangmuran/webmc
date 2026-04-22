import { describe, it, expect } from 'vitest';
import { drink, badOmenToTrialOmen, BAD_OMEN_DURATION_TICKS } from './ominous_bottle';

describe('ominous bottle', () => {
  it('drink applies bad omen', () => {
    const r = drink({ amplifier: 2 });
    expect(r.effect).toBe('bad_omen');
    expect(r.amplifier).toBe(2);
    expect(r.durationTicks).toBe(BAD_OMEN_DURATION_TICKS);
  });

  it('duration is 100 minutes', () => {
    expect(BAD_OMEN_DURATION_TICKS).toBe(120000);
  });

  it('trial omen caps at 4', () => {
    expect(badOmenToTrialOmen(10)).toBe(4);
  });

  it('trial omen preserves level', () => {
    expect(badOmenToTrialOmen(3)).toBe(3);
  });

  it('trial omen clamps below 0', () => {
    expect(badOmenToTrialOmen(-1)).toBe(0);
  });
});
