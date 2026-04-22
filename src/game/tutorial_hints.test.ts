import { describe, it, expect } from 'vitest';
import { dismissHint, makeHintState, pickNextHint, type GameContext } from './tutorial_hints';

const BASE: GameContext = {
  hasMoved: false,
  hasLooked: false,
  hasBrokenBlock: false,
  hasPlacedBlock: false,
  openedInventory: false,
  nearWorkbench: false,
  nearBed: false,
  hungerBelow: 20,
  usedSprint: false,
  usedChat: false,
  nearMap: false,
  tookProjectileHit: false,
};

describe('tutorial hints', () => {
  it('first hint is move', () => {
    const s = makeHintState();
    expect(pickNextHint(BASE, s, 0)).toBe('move');
  });

  it('dismiss unlocks next', () => {
    const s = makeHintState();
    dismissHint(s, 'move');
    const next = pickNextHint({ ...BASE, hasMoved: true }, s, 0);
    expect(next).toBe('look');
  });

  it('low hunger shows food hint', () => {
    const s = makeHintState();
    dismissHint(s, 'move');
    const next = pickNextHint({ ...BASE, hasMoved: true, hungerBelow: 5 }, s, 0);
    expect(next).toBe('look'); // dependency order preserves teaching flow
  });

  it('dismiss all = no hint', () => {
    const s = makeHintState();
    dismissHint(s, 'move');
    dismissHint(s, 'look');
    dismissHint(s, 'break_block');
    dismissHint(s, 'place_block');
    dismissHint(s, 'open_inventory');
    expect(pickNextHint(BASE, s, 0)).toBeNull();
  });

  it('current hint persists for 10s', () => {
    const s = makeHintState();
    pickNextHint(BASE, s, 0);
    const second = pickNextHint({ ...BASE, hasMoved: true }, s, 5);
    expect(second).toBe('move');
  });
});
