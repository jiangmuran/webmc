// Forward-only save schema migrations. Each migration takes the
// previous-version blob and returns the next-version blob; the engine
// applies them in sequence from the file's stored version to LATEST.
// Never downgrade — users' worlds are append-only forward.

export interface MigrationFn<From, To> {
  readonly fromVersion: number;
  readonly toVersion: number;
  migrate(input: From): To;
}

// Polymorphic version because migrations vary shape; we type-erase here
// and assert per-migration in the registry.
type AnyMigration = MigrationFn<unknown, unknown>;

export class MigrationRegistry {
  private readonly byFrom = new Map<number, AnyMigration>();

  register<From, To>(m: MigrationFn<From, To>): void {
    if (m.toVersion <= m.fromVersion) {
      throw new Error(`migration must advance version: ${m.fromVersion}→${m.toVersion}`);
    }
    if (this.byFrom.has(m.fromVersion)) {
      throw new Error(`duplicate migration from version ${m.fromVersion}`);
    }
    this.byFrom.set(m.fromVersion, m as unknown as AnyMigration); // eslint-disable-line @typescript-eslint/no-unnecessary-type-assertion
  }

  latestVersion(initial: number): number {
    let v = initial;
    while (this.byFrom.has(v)) {
      const m = this.byFrom.get(v);
      if (!m) break;
      v = m.toVersion;
    }
    return v;
  }

  migrate(blob: unknown, fromVersion: number, targetVersion: number): unknown {
    let v = fromVersion;
    let cur = blob;
    while (v < targetVersion) {
      const m = this.byFrom.get(v);
      if (!m) {
        throw new Error(`no migration from version ${v}`);
      }
      cur = m.migrate(cur);
      v = m.toVersion;
    }
    return cur;
  }
}
