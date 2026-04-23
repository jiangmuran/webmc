import { describe, it, expect } from 'vitest';
import { make, touch, needsMigration, CURRENT_VERSION } from './world_export_manifest';

describe('world export manifest', () => {
  it('make sets fields', () => {
    const m = make('w', 42, 'survival');
    expect(m.worldName).toBe('w');
    expect(m.seed).toBe(42);
    expect(m.version).toBe(CURRENT_VERSION);
  });

  it('touch updates updatedAt', () => {
    const m = make('w', 42, 'survival');
    const later = touch({ ...m, updatedAt: 0 });
    expect(later.updatedAt).toBeGreaterThan(0);
  });

  it('migration flag for old version', () => {
    const m = { ...make('w', 0, 'survival'), version: -1 };
    expect(needsMigration(m)).toBe(true);
  });
});
