import { describe, it, expect } from 'vitest';
import {
  onHostileNearby,
  shouldAttackPlayer,
  beginAnger,
  tick,
  offerPoppyDisarms,
  REPUTATION_ANGER_THRESHOLD,
  ANGER_DURATION_TICKS,
} from './iron_golem_anger';

describe('iron golem anger', () => {
  it('hostile recognized', () => {
    expect(onHostileNearby('zombie')).toBe(true);
    expect(onHostileNearby('cow')).toBe(false);
  });

  it('low rep attacks player', () => {
    expect(shouldAttackPlayer(REPUTATION_ANGER_THRESHOLD - 1)).toBe(true);
    expect(shouldAttackPlayer(0)).toBe(false);
  });

  it('begin anger sets duration', () => {
    expect(beginAnger('player1').angryTicksRemaining).toBe(ANGER_DURATION_TICKS);
  });

  it('tick expires', () => {
    let a = beginAnger('p');
    for (let i = 0; i < ANGER_DURATION_TICKS; i++) a = tick(a);
    expect(a.angryAt).toBeNull();
  });

  it('poppy disarms different target', () => {
    expect(offerPoppyDisarms('creeper', 'player1')).toBe(true);
    expect(offerPoppyDisarms('player1', 'player1')).toBe(false);
  });
});
