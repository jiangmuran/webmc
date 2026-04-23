import { describe, it, expect } from 'vitest';
import { applyServerPos, pushInput } from './client_prediction';

describe('client prediction', () => {
  const start = { serverX: 0, serverZ: 0, localX: 0, localZ: 0, unacked: [] };

  it('pushInput moves local', () => {
    const c = pushInput(start, { seq: 1, tick: 1, dx: 1, dz: 0 });
    expect(c.localX).toBe(1);
    expect(c.unacked).toHaveLength(1);
  });

  it('server ack trims unacked', () => {
    let c = pushInput(start, { seq: 1, tick: 1, dx: 1, dz: 0 });
    c = pushInput(c, { seq: 2, tick: 2, dx: 1, dz: 0 });
    c = applyServerPos(c, 1, 0, 1);
    expect(c.unacked).toHaveLength(1);
    expect(c.localX).toBe(2);
  });

  it('full ack zeroes unacked', () => {
    let c = pushInput(start, { seq: 1, tick: 1, dx: 1, dz: 0 });
    c = applyServerPos(c, 1, 0, 10);
    expect(c.unacked).toHaveLength(0);
  });
});
