import { describe, it, expect } from 'vitest';
import { makeState, setField, buildDelta, fieldCount, latestVersion } from './delta_state_sync';

describe('delta state sync', () => {
  it('new client gets full state', () => {
    const s = makeState();
    setField(s, 'health', 20);
    setField(s, 'x', 100);
    const d = buildDelta(s, 0);
    expect(d.size).toBe(2);
  });

  it('caught-up client gets nothing', () => {
    const s = makeState();
    setField(s, 'x', 1);
    const v = latestVersion(s);
    expect(buildDelta(s, v).size).toBe(0);
  });

  it('delta after changes', () => {
    const s = makeState();
    setField(s, 'x', 1);
    const ack = latestVersion(s);
    setField(s, 'y', 2);
    const d = buildDelta(s, ack);
    expect(d.size).toBe(1);
    expect(d.has('y')).toBe(true);
  });

  it('field count tracks', () => {
    const s = makeState();
    setField(s, 'x', 1);
    setField(s, 'y', 2);
    expect(fieldCount(s)).toBe(2);
  });
});
