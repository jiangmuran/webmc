import { describe, it, expect } from 'vitest';
import { StatsTracker } from './stats';

describe('StatsTracker', () => {
  it('starts at 0 for every counter', () => {
    const s = new StatsTracker();
    expect(s.get('distance_walked')).toBe(0);
    expect(s.get('blocks_mined')).toBe(0);
  });

  it('inc adds by 1 by default', () => {
    const s = new StatsTracker();
    s.inc('blocks_mined');
    s.inc('blocks_mined');
    expect(s.get('blocks_mined')).toBe(2);
  });

  it('inc with explicit amount', () => {
    const s = new StatsTracker();
    s.inc('damage_taken', 5);
    s.inc('damage_taken', 3);
    expect(s.get('damage_taken')).toBe(8);
  });

  it('incBlock also bumps the per-block counter', () => {
    const s = new StatsTracker();
    s.incBlock('webmc:stone');
    s.incBlock('webmc:stone');
    s.incBlock('webmc:dirt');
    expect(s.blocksMined('webmc:stone')).toBe(2);
    expect(s.blocksMined('webmc:dirt')).toBe(1);
    expect(s.get('blocks_mined')).toBe(3);
  });

  it('incKill bumps per-mob counter', () => {
    const s = new StatsTracker();
    s.incKill('zombie');
    s.incKill('zombie');
    s.incKill('skeleton');
    expect(s.mobsKilled('zombie')).toBe(2);
    expect(s.get('mobs_killed')).toBe(3);
  });

  it('serialize + hydrate round-trips data', () => {
    const a = new StatsTracker();
    a.inc('distance_walked', 500);
    a.incBlock('webmc:oak_log');
    a.incKill('pig');
    const data = a.serialize();
    const b = new StatsTracker();
    b.hydrate(data);
    expect(b.get('distance_walked')).toBe(500);
    expect(b.blocksMined('webmc:oak_log')).toBe(1);
    expect(b.mobsKilled('pig')).toBe(1);
  });
});
