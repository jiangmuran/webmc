import { describe, it, expect } from 'vitest';
import { ClientReconcile } from './network_lag_compensation';

describe('client reconcile', () => {
  it('reconciles with snapshot', () => {
    const r = new ClientReconcile();
    r.record({ seq: 1, dx: 1, dy: 0, dz: 0 });
    r.record({ seq: 2, dx: 1, dy: 0, dz: 0 });
    r.record({ seq: 3, dx: 1, dy: 0, dz: 0 });
    const out = r.reconcile({ seq: 1, x: 10, y: 0, z: 0 });
    expect(out.x).toBe(12);
    expect(r.unackedCount).toBe(2);
  });

  it('full ack empties queue', () => {
    const r = new ClientReconcile();
    r.record({ seq: 1, dx: 1, dy: 0, dz: 0 });
    r.record({ seq: 2, dx: 1, dy: 0, dz: 0 });
    const out = r.reconcile({ seq: 5, x: 100, y: 0, z: 0 });
    expect(out.x).toBe(100);
    expect(r.unackedCount).toBe(0);
  });

  it('no ack = full replay', () => {
    const r = new ClientReconcile();
    r.record({ seq: 10, dx: 2, dy: 0, dz: 0 });
    const out = r.reconcile({ seq: 0, x: 0, y: 0, z: 0 });
    expect(out.x).toBe(2);
  });
});
