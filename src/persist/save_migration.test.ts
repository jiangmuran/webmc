import { describe, it, expect } from 'vitest';
import { MigrationRegistry } from './save_migration';

interface V1 {
  name: string;
}
interface V2 {
  name: string;
  createdAt: number;
}
interface V3 {
  name: string;
  createdAt: number;
  seed: number;
}

describe('save migration', () => {
  it('latestVersion walks the chain', () => {
    const r = new MigrationRegistry();
    r.register({
      fromVersion: 1,
      toVersion: 2,
      migrate: (v: V1): V2 => ({ ...v, createdAt: 0 }),
    });
    r.register({
      fromVersion: 2,
      toVersion: 3,
      migrate: (v: V2): V3 => ({ ...v, seed: 0 }),
    });
    expect(r.latestVersion(1)).toBe(3);
  });

  it('migrate runs all steps in order', () => {
    const r = new MigrationRegistry();
    r.register({
      fromVersion: 1,
      toVersion: 2,
      migrate: (v: V1): V2 => ({ ...v, createdAt: 1 }),
    });
    r.register({
      fromVersion: 2,
      toVersion: 3,
      migrate: (v: V2): V3 => ({ ...v, seed: 42 }),
    });
    const out = r.migrate({ name: 'world' }, 1, 3) as V3;
    expect(out.name).toBe('world');
    expect(out.createdAt).toBe(1);
    expect(out.seed).toBe(42);
  });

  it('rejects backwards migrations', () => {
    const r = new MigrationRegistry();
    expect(() => {
      r.register({ fromVersion: 3, toVersion: 2, migrate: (v) => v });
    }).toThrow();
  });

  it('rejects duplicate from-version', () => {
    const r = new MigrationRegistry();
    r.register({ fromVersion: 1, toVersion: 2, migrate: (v) => v });
    expect(() => {
      r.register({ fromVersion: 1, toVersion: 2, migrate: (v) => v });
    }).toThrow();
  });

  it('throws when a step is missing', () => {
    const r = new MigrationRegistry();
    r.register({ fromVersion: 1, toVersion: 2, migrate: (v) => v });
    expect(() => r.migrate({}, 1, 3)).toThrow();
  });
});
