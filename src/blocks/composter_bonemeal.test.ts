import { describe, it, expect } from 'vitest';
import { addCompost, extractBonemeal, composterFillChance, MAX_LEVEL } from './composter_bonemeal';

describe('composter bonemeal', () => {
  const empty = { level: 0, readyForBonemeal: false };

  it('lucky fills', () => {
    expect(addCompost(empty, 1, () => 0).level).toBe(1);
  });

  it('unlucky skips', () => {
    expect(addCompost(empty, 0.5, () => 0.9).level).toBe(0);
  });

  it('max level ready for bonemeal', () => {
    let c = empty;
    for (let i = 0; i < MAX_LEVEL; i++) c = addCompost(c, 1, () => 0);
    expect(c.readyForBonemeal).toBe(true);
  });

  it('extract resets', () => {
    const r = extractBonemeal({ level: MAX_LEVEL, readyForBonemeal: true });
    expect(r.level).toBe(0);
    expect(r.readyForBonemeal).toBe(false);
  });

  it('fill chance lookup', () => {
    expect(composterFillChance('seed')).toBeLessThan(composterFillChance('cake'));
  });
});
