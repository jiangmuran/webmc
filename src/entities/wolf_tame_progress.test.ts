import { describe, it, expect } from 'vitest';
import {
  feedBone,
  setSit,
  dyeCollar,
  isHostileToTarget,
  type WolfState,
} from './wolf_tame_progress';

function mk(): WolfState {
  return { tamed: false, owner: null, sitting: false, collarColor: '' };
}

describe('wolf tame progress', () => {
  it('tame on lucky roll', () => {
    const w = feedBone(mk(), 'p1', () => 0);
    expect(w.tamed).toBe(true);
    expect(w.owner).toBe('p1');
  });

  it('no tame on high roll', () => {
    expect(feedBone(mk(), 'p1', () => 0.9).tamed).toBe(false);
  });

  it('sit requires owner', () => {
    const tame = feedBone(mk(), 'p1', () => 0);
    expect(setSit(tame, 'p2', true).sitting).toBe(false);
    expect(setSit(tame, 'p1', true).sitting).toBe(true);
  });

  it('dye collar', () => {
    const tame = feedBone(mk(), 'p1', () => 0);
    expect(dyeCollar(tame, 'p1', 'blue').collarColor).toBe('blue');
  });

  it('hostile to skeletons when tame', () => {
    const tame = feedBone(mk(), 'p1', () => 0);
    expect(isHostileToTarget(tame, 'skeleton')).toBe(true);
  });

  it('wild not hostile to skel', () => {
    expect(isHostileToTarget(mk(), 'skeleton')).toBe(false);
  });
});
