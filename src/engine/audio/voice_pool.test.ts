import { describe, it, expect } from 'vitest';
import { makePool, play, stop, activeCount } from './voice_pool';

describe('voice pool', () => {
  it('play adds voice', () => {
    const p = makePool(4);
    play(p, 1, 'a', 0);
    expect(activeCount(p)).toBe(1);
  });

  it('caps at maxVoices by stealing lower priority', () => {
    const p = makePool(2);
    play(p, 1, 'a', 0);
    play(p, 1, 'b', 1);
    const third = play(p, 2, 'c', 2);
    expect(third).not.toBeNull();
    expect(activeCount(p)).toBe(2);
  });

  it('cannot steal when all higher priority', () => {
    const p = makePool(1);
    play(p, 10, 'a', 0);
    expect(play(p, 1, 'b', 1)).toBeNull();
  });

  it('stop removes', () => {
    const p = makePool(4);
    const v = play(p, 1, 'a', 0);
    if (!v) throw new Error('no voice');
    expect(stop(p, v.id)).toBe(true);
    expect(activeCount(p)).toBe(0);
  });

  it('stop missing returns false', () => {
    const p = makePool(4);
    expect(stop(p, 999)).toBe(false);
  });
});
