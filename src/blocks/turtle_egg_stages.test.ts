import { describe, it, expect } from 'vitest';
import {
  isNightAdvanceable,
  advance,
  readyToHatch,
  stompChance,
  type TurtleEggBlock,
} from './turtle_egg_stages';

const base: TurtleEggBlock = {
  eggs: 3,
  hatch: 0,
  onSand: true,
  skyLightLevel: 15,
};

describe('turtle egg stages', () => {
  it('advances at night on sand', () => {
    expect(isNightAdvanceable(base, true, () => 0.01)).toBe(true);
  });

  it('no advance during day', () => {
    expect(isNightAdvanceable(base, false, () => 0.01)).toBe(false);
  });

  it('no advance off sand', () => {
    expect(isNightAdvanceable({ ...base, onSand: false }, true, () => 0.01)).toBe(false);
  });

  it('advance increments stage', () => {
    expect(advance(base).hatch).toBe(1);
  });

  it('ready to hatch at stage 2', () => {
    expect(readyToHatch({ ...base, hatch: 2 })).toBe(true);
  });

  it('sprinting stomps more often', () => {
    expect(stompChance(true)).toBeGreaterThan(stompChance(false));
  });
});
