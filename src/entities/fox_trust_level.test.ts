import { describe, it, expect } from 'vitest';
import {
  makeFox,
  onBredByPlayer,
  trustsPlayer,
  fleesFrom,
  canPickUpDroppedItem,
} from './fox_trust_level';

describe('fox trust level', () => {
  it('bred baby trusts breeder', () => {
    const f = makeFox(true);
    onBredByPlayer(f, 'p1');
    expect(trustsPlayer(f, 'p1')).toBe(true);
  });

  it('adult bred doesnt trust', () => {
    const f = makeFox(false);
    onBredByPlayer(f, 'p1');
    expect(trustsPlayer(f, 'p1')).toBe(false);
  });

  it('flees unknown', () => {
    const f = makeFox(true);
    expect(fleesFrom(f, 'stranger')).toBe(true);
  });

  it('no flee after trust', () => {
    const f = makeFox(true);
    onBredByPlayer(f, 'p1');
    expect(fleesFrom(f, 'p1')).toBe(false);
  });

  it('picks items', () => {
    expect(canPickUpDroppedItem()).toBe(true);
  });
});
