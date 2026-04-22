import { describe, it, expect } from 'vitest';
import { beeAngered, beePollinate, depositAtNest, makeBee, sting, tickBee } from './bee';

describe('bee', () => {
  it('pollination marks the bee and sets return mood if home set', () => {
    const b = makeBee({ x: 0, y: 80, z: 0 });
    beePollinate(b);
    expect(b.pollinated).toBe(true);
    expect(b.mood).toBe('return_home');
  });

  it('depositAtNest clears pollination', () => {
    const b = makeBee({ x: 0, y: 80, z: 0 });
    beePollinate(b);
    expect(depositAtNest(b)).toBe(true);
    expect(b.pollinated).toBe(false);
  });

  it('angered bee stings and dies', () => {
    const b = makeBee();
    beeAngered(b, 1);
    const s = sting(b);
    expect(s.damageDealt).toBe(2);
    expect(s.beeDies).toBe(true);
  });

  it('anger expires over time', () => {
    const b = makeBee();
    beeAngered(b, 1);
    tickBee(b, 30);
    expect(b.mood).toBe('wander');
    expect(b.angerSec).toBe(0);
  });

  it('pollinated bee without home wanders', () => {
    const b = makeBee();
    beePollinate(b);
    expect(b.mood).toBe('wander');
  });
});
