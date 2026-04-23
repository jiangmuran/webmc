import { describe, it, expect } from 'vitest';
import { empty, addEvent, decayOneDay, reputation } from './villager_gossip';

describe('villager gossip', () => {
  it('starts empty', () => {
    const g = empty();
    expect(reputation(g)).toBe(0);
  });

  it('trading adds reputation', () => {
    const g = addEvent(empty(), 'trading', 5);
    expect(reputation(g)).toBe(5);
  });

  it('major negative costs heavily', () => {
    const g = addEvent(empty(), 'major_negative', 2);
    expect(reputation(g)).toBe(-10);
  });

  it('trading decays daily', () => {
    const g = addEvent(empty(), 'trading', 10);
    const next = decayOneDay(g);
    expect(next.trading).toBeLessThan(g.trading);
  });

  it('major positive does not decay', () => {
    const g = addEvent(empty(), 'major_positive', 5);
    expect(decayOneDay(g).major_positive).toBe(5);
  });

  it('caps at max', () => {
    const g = addEvent(empty(), 'major_positive', 10000);
    expect(g.major_positive).toBe(20);
  });
});
