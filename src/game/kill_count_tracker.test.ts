import { describe, it, expect } from 'vitest';
import { recordKill, totalKills, killsOf } from './kill_count_tracker';

describe('kill count tracker', () => {
  const empty = { kills: {}, deaths: 0, distanceWalked: 0, timePlayedTicks: 0 };

  it('records kill', () => {
    const s = recordKill(empty, 'zombie');
    expect(killsOf(s, 'zombie')).toBe(1);
  });

  it('accumulates multiple', () => {
    let s = empty;
    s = recordKill(s, 'zombie');
    s = recordKill(s, 'zombie');
    s = recordKill(s, 'skeleton');
    expect(totalKills(s)).toBe(3);
    expect(killsOf(s, 'zombie')).toBe(2);
  });

  it('zero for unknown', () => {
    expect(killsOf(empty, 'creeper')).toBe(0);
  });
});
