import { describe, it, expect } from 'vitest';
import { rotateBackups, pickRestore, totalBytes, MAX_BACKUPS } from './save_backup';

describe('save backup', () => {
  it('rotates into slot 1', () => {
    const list = rotateBackups([], { timestampMs: 1000, bytes: 100 });
    expect(list[0]?.slot).toBe(1);
  });

  it('drops oldest beyond limit', () => {
    let list: ReturnType<typeof rotateBackups> = [];
    for (let i = 0; i < MAX_BACKUPS + 3; i++) {
      list = rotateBackups(list, { timestampMs: i * 1000, bytes: 100 });
    }
    expect(list.length).toBe(MAX_BACKUPS);
    expect(list.map((b) => b.slot).sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('restore by slot', () => {
    let list: ReturnType<typeof rotateBackups> = [];
    for (let i = 0; i < 3; i++) {
      list = rotateBackups(list, { timestampMs: i, bytes: 10 });
    }
    const slot2 = pickRestore(list, 2);
    expect(slot2?.timestampMs).toBe(1);
  });

  it('totalBytes sums', () => {
    const list = [
      { slot: 1, timestampMs: 0, bytes: 100 },
      { slot: 2, timestampMs: 0, bytes: 50 },
    ];
    expect(totalBytes(list)).toBe(150);
  });
});
