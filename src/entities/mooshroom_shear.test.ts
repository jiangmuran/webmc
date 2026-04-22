import { describe, it, expect } from 'vitest';
import { bowlInteract, feedFlowerToBrown, makeMooshroom, shear } from './mooshroom_shear';

describe('mooshroom', () => {
  it('shear red drops red mushrooms', () => {
    const m = makeMooshroom('red');
    const r = shear(m);
    expect(r.becameCow).toBe(true);
    expect(r.drops[0]?.item).toBe('webmc:red_mushroom');
    expect(r.drops[0]?.count).toBe(5);
  });

  it('shear brown drops brown', () => {
    const m = makeMooshroom('brown');
    expect(shear(m).drops[0]?.item).toBe('webmc:brown_mushroom');
  });

  it('bowl yields mushroom stew', () => {
    const m = makeMooshroom('red');
    const r = bowlInteract(m);
    expect(r.stew?.item).toBe('webmc:mushroom_stew');
  });

  it('sheared mooshroom gives no stew', () => {
    const m = makeMooshroom('red');
    shear(m);
    expect(bowlInteract(m).stew).toBeNull();
  });

  it('feed flower to brown for suspicious', () => {
    const m = makeMooshroom('brown');
    const ok = feedFlowerToBrown(m, 'webmc:poppy');
    expect(ok.accepted).toBe(true);
    const stew = bowlInteract(m);
    expect(stew.stew?.item).toBe('webmc:suspicious_stew');
    expect(stew.stew?.effect?.id).toBe('night_vision');
  });

  it('red mooshroom rejects flower', () => {
    const m = makeMooshroom('red');
    expect(feedFlowerToBrown(m, 'webmc:poppy').accepted).toBe(false);
  });

  it('cannot feed second flower before bowling', () => {
    const m = makeMooshroom('brown');
    feedFlowerToBrown(m, 'webmc:poppy');
    expect(feedFlowerToBrown(m, 'webmc:allium').reason).toBe('already_loaded');
  });
});
