import { describe, it, expect } from 'vitest';
import { makeAxolotl, onAxolotlHurt, rollBabyColor, tickAxolotl } from './axolotl';

describe('axolotl', () => {
  it('triggers play-dead on first hurt', () => {
    const a = makeAxolotl();
    expect(onAxolotlHurt(a)).toBe(true);
    expect(a.playingDead).toBe(true);
  });

  it('cannot play dead during cooldown', () => {
    const a = makeAxolotl();
    onAxolotlHurt(a);
    tickAxolotl(a, 10); // play-dead duration ends
    expect(onAxolotlHurt(a)).toBe(false);
  });

  it('regenerates HP while playing dead', () => {
    const a = makeAxolotl();
    a.hp = 10;
    onAxolotlHurt(a);
    tickAxolotl(a, 5);
    expect(a.hp).toBeGreaterThan(10);
  });

  it('baby color: rare blue drop', () => {
    expect(rollBabyColor('wild', 'gold', () => 0)).toBe('blue');
  });

  it('baby color: parent coin flip', () => {
    expect(rollBabyColor('wild', 'gold', () => 0.4)).toBe('wild');
    expect(rollBabyColor('wild', 'gold', () => 0.9)).toBe('gold');
  });
});
