import { describe, it, expect } from 'vitest';
import {
  makeBee,
  collectPollen,
  depositAtHive,
  tickAnger,
  anger,
  isAngry,
} from './bee_pollen_carry';

describe('bee pollen', () => {
  it('collect once', () => {
    const b = makeBee();
    expect(collectPollen(b)).toBe(true);
    expect(collectPollen(b)).toBe(false);
  });

  it('deposit increments honey', () => {
    const b = makeBee();
    collectPollen(b);
    const r = depositAtHive(b);
    expect(r.honeyIncrement).toBe(1);
    expect(b.carryingPollen).toBe(false);
  });

  it('no pollen, no deposit', () => {
    const b = makeBee();
    expect(depositAtHive(b).honeyIncrement).toBe(0);
  });

  it('anger ticks down', () => {
    const b = makeBee();
    anger(b, 5);
    expect(isAngry(b)).toBe(true);
    for (let i = 0; i < 5; i++) tickAnger(b);
    expect(isAngry(b)).toBe(false);
  });

  it('anger duration max', () => {
    const b = makeBee();
    anger(b, 10);
    anger(b, 3);
    expect(b.angerTicksRemaining).toBe(10);
  });
});
