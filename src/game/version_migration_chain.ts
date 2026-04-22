// Save file migration chain. Each migration transforms from version N
// to N+1. Apply in sequence from the saved version to the current
// schema version.

export interface Migration {
  from: number;
  to: number;
  apply: (save: unknown) => unknown;
}

export class MigrationChain {
  private migrations: Migration[] = [];

  register(m: Migration): void {
    if (m.to !== m.from + 1) throw new Error('migrations must be +1');
    this.migrations.push(m);
    this.migrations.sort((a, b) => a.from - b.from);
  }

  latestVersion(): number {
    return this.migrations.reduce((max, m) => Math.max(max, m.to), 0);
  }

  migrate(save: { version: number; data: unknown }): { version: number; data: unknown } {
    let current = save;
    while (current.version < this.latestVersion()) {
      const next = this.migrations.find((m) => m.from === current.version);
      if (!next) throw new Error(`no migration from version ${current.version}`);
      current = { version: next.to, data: next.apply(current.data) };
    }
    return current;
  }
}
