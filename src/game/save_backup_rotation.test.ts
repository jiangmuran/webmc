import { describe, it, expect } from 'vitest';
import { makeRing, addBackup, latest, totalBytes, uniqueById } from './save_backup_rotation';

describe('save backup rotation', () => {
  it('retains max', () => {
    const r = makeRing(3);
    for (let i = 0; i < 5; i++) addBackup(r, { timestampMs: i * 1000, bytes: 100, id: `b${i}` });
    expect(r.entries.length).toBe(3);
  });

  it('evicts oldest', () => {
    const r = makeRing(2);
    addBackup(r, { timestampMs: 0, bytes: 1, id: 'a' });
    addBackup(r, { timestampMs: 1000, bytes: 1, id: 'b' });
    const ev = addBackup(r, { timestampMs: 2000, bytes: 1, id: 'c' });
    expect(ev?.id).toBe('a');
  });

  it('latest', () => {
    const r = makeRing();
    addBackup(r, { timestampMs: 10, bytes: 1, id: 'a' });
    addBackup(r, { timestampMs: 20, bytes: 1, id: 'b' });
    expect(latest(r)?.id).toBe('b');
  });

  it('total bytes', () => {
    const r = makeRing();
    addBackup(r, { timestampMs: 0, bytes: 100, id: 'a' });
    addBackup(r, { timestampMs: 1, bytes: 200, id: 'b' });
    expect(totalBytes(r)).toBe(300);
  });

  it('uniqueById dedupe', () => {
    const r = makeRing();
    addBackup(r, { timestampMs: 0, bytes: 1, id: 'a' });
    addBackup(r, { timestampMs: 1, bytes: 1, id: 'a' });
    expect(uniqueById(r).length).toBe(1);
  });
});
