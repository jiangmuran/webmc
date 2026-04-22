import { describe, it, expect } from 'vitest';
import { MigrationChain } from './version_migration_chain';

describe('migration chain', () => {
  it('applies sequential migrations', () => {
    const c = new MigrationChain();
    c.register({ from: 1, to: 2, apply: (d) => ({ ...(d as object), step2: true }) });
    c.register({ from: 2, to: 3, apply: (d) => ({ ...(d as object), step3: true }) });
    const out = c.migrate({ version: 1, data: { original: 'yes' } });
    expect(out.version).toBe(3);
    expect((out.data as Record<string, unknown>)['step2']).toBe(true);
    expect((out.data as Record<string, unknown>)['step3']).toBe(true);
  });

  it('no-op at latest', () => {
    const c = new MigrationChain();
    c.register({ from: 1, to: 2, apply: (d) => d });
    const out = c.migrate({ version: 2, data: {} });
    expect(out.version).toBe(2);
  });

  it('missing migration throws', () => {
    const c = new MigrationChain();
    c.register({ from: 2, to: 3, apply: (d) => d });
    expect(() => c.migrate({ version: 1, data: {} })).toThrow();
  });

  it('non-consecutive rejected', () => {
    const c = new MigrationChain();
    expect(() => {
      c.register({ from: 1, to: 3, apply: (d) => d });
    }).toThrow();
  });
});
