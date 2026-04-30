import { describe, it, expect } from 'vitest';
import {
  makePiglin,
  isHostileTo,
  throwGoldAt,
  attacked,
  DISTRACTION_TICKS,
} from './piglin_distraction';

describe('piglin', () => {
  it('not hostile to full-gold player', () => {
    const s = makePiglin();
    expect(
      isHostileTo(
        s,
        {
          playerWearsFullGold: true,
          playerOpenedChestNearby: false,
          playerAttackedRecently: false,
          nowTick: 0,
        },
        'p1',
      ),
    ).toBe(false);
  });

  it('gold but opened chest → hostile', () => {
    const s = makePiglin();
    expect(
      isHostileTo(
        s,
        {
          playerWearsFullGold: true,
          playerOpenedChestNearby: true,
          playerAttackedRecently: false,
          nowTick: 0,
        },
        'p1',
      ),
    ).toBe(true);
  });

  it('gold throw distracts', () => {
    const s = makePiglin();
    throwGoldAt(s, 100);
    expect(
      isHostileTo(
        s,
        {
          playerWearsFullGold: false,
          playerOpenedChestNearby: false,
          playerAttackedRecently: false,
          nowTick: 100 + DISTRACTION_TICKS - 1,
        },
        'p1',
      ),
    ).toBe(false);
    expect(
      isHostileTo(
        s,
        {
          playerWearsFullGold: false,
          playerOpenedChestNearby: false,
          playerAttackedRecently: false,
          nowTick: 100 + DISTRACTION_TICKS + 1,
        },
        'p1',
      ),
    ).toBe(true);
  });

  it('attack clears distraction', () => {
    const s = makePiglin();
    throwGoldAt(s, 0);
    attacked(s, 'p1', 10);
    expect(
      isHostileTo(
        s,
        {
          playerWearsFullGold: true,
          playerOpenedChestNearby: false,
          playerAttackedRecently: true,
          nowTick: 11,
        },
        'p1',
      ),
    ).toBe(true);
  });

  it('any single piece of gold armor pacifies (wiki)', () => {
    const s = makePiglin();
    expect(
      isHostileTo(
        s,
        {
          playerWearsAnyGoldArmor: true,
          playerOpenedChestNearby: false,
          playerAttackedRecently: false,
          nowTick: 0,
        },
        'p1',
      ),
    ).toBe(false);
  });

  it('hostile when no gold armor', () => {
    const s = makePiglin();
    expect(
      isHostileTo(
        s,
        {
          playerWearsAnyGoldArmor: false,
          playerOpenedChestNearby: false,
          playerAttackedRecently: false,
          nowTick: 0,
        },
        'p1',
      ),
    ).toBe(true);
  });
});
