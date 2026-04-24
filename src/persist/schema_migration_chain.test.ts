import { describe, it, expect } from 'vitest';
import { planFor, latestVersion, type MigrationContext } from './schema_migration_chain';

const ctx: MigrationContext = {
  known: [
    { from: 1, to: 2, name: 'add_entities_index' },
    { from: 2, to: 3, name: 'compress_chunks' },
    { from: 3, to: 4, name: 'palette_v2' },
  ],
};

describe('schema migration chain', () => {
  it('same version no steps', () => {
    expect(planFor(3, 3, ctx)).toEqual([]);
  });

  it('plans forward steps', () => {
    expect(planFor(1, 4, ctx)).toHaveLength(3);
  });

  it('missing step gap → undefined', () => {
    const gap: MigrationContext = { known: [{ from: 1, to: 2, name: 'a' }] };
    expect(planFor(1, 4, gap)).toBeUndefined();
  });

  it('downgrade rejected', () => {
    expect(planFor(4, 2, ctx)).toBeUndefined();
  });

  it('latest version', () => {
    expect(latestVersion(ctx)).toBe(4);
  });
});
