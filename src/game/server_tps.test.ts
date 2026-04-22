import { describe, it, expect } from 'vitest';
import { suggestedRandomTickSpeed, TpsMonitor } from './server_tps';

describe('tps monitor', () => {
  it('empty window = target TPS', () => {
    expect(new TpsMonitor().currentTps).toBe(20);
  });

  it('50ms ticks = 20 TPS', () => {
    const m = new TpsMonitor();
    for (let i = 0; i < 10; i++) m.observeTick(50);
    expect(m.currentTps).toBeCloseTo(20);
  });

  it('slow ticks = low TPS', () => {
    const m = new TpsMonitor();
    for (let i = 0; i < 10; i++) m.observeTick(200);
    expect(m.currentTps).toBeCloseTo(5);
  });

  it('lagging flag triggers', () => {
    const m = new TpsMonitor();
    for (let i = 0; i < 10; i++) m.observeTick(100);
    expect(m.lagging).toBe(true);
  });

  it('p95 captures tail', () => {
    const m = new TpsMonitor();
    for (let i = 0; i < 95; i++) m.observeTick(50);
    for (let i = 0; i < 5; i++) m.observeTick(500);
    expect(m.p95TickMs).toBeGreaterThan(50);
  });

  it('reset clears window', () => {
    const m = new TpsMonitor();
    m.observeTick(200);
    m.reset();
    expect(m.currentTps).toBe(20);
  });

  it('auto-reduce random tick speed under lag', () => {
    const n = suggestedRandomTickSpeed({
      currentTps: 5,
      targetTps: 20,
      currentRandomTickSpeed: 3,
    });
    expect(n).toBeLessThanOrEqual(1);
  });

  it('no reduction at healthy TPS', () => {
    const n = suggestedRandomTickSpeed({
      currentTps: 20,
      targetTps: 20,
      currentRandomTickSpeed: 3,
    });
    expect(n).toBe(3);
  });
});
