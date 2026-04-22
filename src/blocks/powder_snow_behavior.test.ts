import { describe, it, expect } from 'vitest';
import {
  sinks,
  freezeDamageThisTick,
  goatJumpsOut,
  FREEZE_DAMAGE_START_TICKS,
  FREEZE_DAMAGE_INTERVAL_TICKS,
  FREEZE_DAMAGE,
} from './powder_snow_behavior';

describe('powder snow', () => {
  it('player without boots sinks', () => {
    expect(sinks({ ticksInPowderSnow: 0, wearsLeatherBoots: false, mobKind: 'player' })).toBe(true);
  });

  it('boots stand', () => {
    expect(sinks({ ticksInPowderSnow: 0, wearsLeatherBoots: true, mobKind: 'player' })).toBe(false);
  });

  it('goat immune', () => {
    expect(sinks({ ticksInPowderSnow: 100, wearsLeatherBoots: false, mobKind: 'goat' })).toBe(
      false,
    );
  });

  it('damage starts after threshold', () => {
    expect(
      freezeDamageThisTick({
        ticksInPowderSnow: FREEZE_DAMAGE_START_TICKS - 1,
        wearsLeatherBoots: false,
        mobKind: 'player',
      }),
    ).toBe(0);
    expect(
      freezeDamageThisTick({
        ticksInPowderSnow: FREEZE_DAMAGE_START_TICKS,
        wearsLeatherBoots: false,
        mobKind: 'player',
      }),
    ).toBe(FREEZE_DAMAGE);
  });

  it('damage every interval', () => {
    expect(
      freezeDamageThisTick({
        ticksInPowderSnow: FREEZE_DAMAGE_START_TICKS + FREEZE_DAMAGE_INTERVAL_TICKS,
        wearsLeatherBoots: false,
        mobKind: 'player',
      }),
    ).toBe(FREEZE_DAMAGE);
  });

  it('goat jumps out', () => {
    expect(goatJumpsOut({ ticksInPowderSnow: 20, wearsLeatherBoots: false, mobKind: 'goat' })).toBe(
      true,
    );
  });
});
