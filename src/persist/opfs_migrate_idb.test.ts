import { describe, it, expect } from 'vitest';
import { progressFraction, shouldUseOpfs, canResume } from './opfs_migrate_idb';

describe('opfs migrate idb', () => {
  it('progress fraction', () => {
    expect(progressFraction({ opfsAvailable: true, migratedChunks: 50, totalChunks: 100 })).toBe(
      0.5,
    );
  });

  it('opfs decision', () => {
    expect(shouldUseOpfs({ opfsAvailable: true, migratedChunks: 0, totalChunks: 100 })).toBe(true);
  });

  it('resume check', () => {
    expect(canResume({ opfsAvailable: true, migratedChunks: 99, totalChunks: 100 })).toBe(true);
    expect(canResume({ opfsAvailable: true, migratedChunks: 100, totalChunks: 100 })).toBe(false);
  });

  it('empty total = done', () => {
    expect(progressFraction({ opfsAvailable: true, migratedChunks: 0, totalChunks: 0 })).toBe(1);
  });
});
