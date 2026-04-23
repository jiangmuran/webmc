import { describe, it, expect } from 'vitest';
import { comparatorSignal, canInsertDisc, ejectDisc } from './jukebox_redstone';

describe('jukebox redstone', () => {
  it('empty zero signal', () => {
    expect(comparatorSignal(null)).toBe(0);
  });

  it('disc 13 = 1', () => {
    expect(comparatorSignal('music_disc_13')).toBe(1);
  });

  it('disc 5 = 15', () => {
    expect(comparatorSignal('music_disc_5')).toBe(15);
  });

  it('insert only when empty', () => {
    expect(canInsertDisc(null)).toBe(true);
    expect(canInsertDisc('music_disc_cat')).toBe(false);
  });

  it('eject stops music', () => {
    expect(ejectDisc().stopsMusic).toBe(true);
  });
});
