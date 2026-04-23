import { describe, it, expect } from 'vitest';
import {
  onPlayerAttack,
  stingTarget,
  diesSoonAfterSting,
  fleeAfterSting,
  ANGER_AFTER_ATTACK,
} from './bee_anger_flee';

describe('bee anger flee', () => {
  it('attack makes angry', () => {
    expect(onPlayerAttack({ angerTicks: 0, stung: false }).angerTicks).toBe(ANGER_AFTER_ATTACK);
  });

  it('sting clears anger', () => {
    expect(stingTarget({ angerTicks: 400, stung: false }).angerTicks).toBe(0);
  });

  it('stung bee flees + dies', () => {
    const b = stingTarget({ angerTicks: 0, stung: false });
    expect(fleeAfterSting(b)).toBe(true);
    expect(diesSoonAfterSting(b)).toBe(true);
  });
});
