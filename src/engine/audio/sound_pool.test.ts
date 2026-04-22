import { describe, it, expect, vi } from 'vitest';
import { SoundPool } from './sound_pool';

describe('sound pool', () => {
  it('plays when under capacity', () => {
    const p = new SoundPool({ maxConcurrent: 2 });
    const stop = vi.fn();
    const inst = p.tryPlay('click', 1, 0.5, 0, stop);
    expect(inst).not.toBeNull();
    expect(p.activeCount).toBe(1);
  });

  it('drops low-priority when full', () => {
    const p = new SoundPool({ maxConcurrent: 1 });
    p.tryPlay('music', 5, 10, 0, vi.fn());
    const attempt = p.tryPlay('click', 1, 0.5, 0, vi.fn());
    expect(attempt).toBeNull();
  });

  it('evicts lowest-priority when higher-priority comes in', () => {
    const p = new SoundPool({ maxConcurrent: 1 });
    const victim = vi.fn();
    p.tryPlay('footstep', 1, 10, 0, victim);
    const winner = p.tryPlay('explosion', 9, 1, 0, vi.fn());
    expect(winner).not.toBeNull();
    expect(victim).toHaveBeenCalled();
  });

  it('tick sweeps finished sounds', () => {
    const p = new SoundPool({ maxConcurrent: 5 });
    const stop = vi.fn();
    p.tryPlay('click', 1, 0.5, 0, stop);
    p.tick(1);
    expect(p.activeCount).toBe(0);
    expect(stop).toHaveBeenCalled();
  });

  it('stopAll clears everything', () => {
    const p = new SoundPool({ maxConcurrent: 5 });
    p.tryPlay('a', 1, 10, 0, vi.fn());
    p.tryPlay('b', 1, 10, 0, vi.fn());
    p.stopAll();
    expect(p.activeCount).toBe(0);
  });
});
