import { describe, it, expect } from 'vitest';
import { applyTime } from './time_command_handler';

describe('/time', () => {
  it('query returns remainder', () => {
    const w = { worldTick: 50000 };
    expect(applyTime(w, { op: 'query' })).toBe(50000 % 24000);
  });

  it('set by number', () => {
    const w = { worldTick: 0 };
    applyTime(w, { op: 'set', value: 6000 });
    expect(w.worldTick % 24000).toBe(6000);
  });

  it('set by name', () => {
    const w = { worldTick: 0 };
    applyTime(w, { op: 'set', value: 'night' });
    expect(w.worldTick % 24000).toBe(13000);
  });

  it('add adds', () => {
    const w = { worldTick: 100 };
    applyTime(w, { op: 'add', value: 50 });
    expect(w.worldTick).toBe(150);
  });

  it('unknown name = 0', () => {
    const w = { worldTick: 1000 };
    applyTime(w, { op: 'set', value: 'xyz' });
    expect(w.worldTick % 24000).toBe(0);
  });
});
