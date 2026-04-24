export interface MigrationStep {
  from: number;
  to: number;
  name: string;
}

export interface MigrationContext {
  readonly known: readonly MigrationStep[];
}

export function planFor(
  currentVersion: number,
  targetVersion: number,
  ctx: MigrationContext,
): readonly MigrationStep[] | undefined {
  if (currentVersion === targetVersion) return [];
  if (targetVersion < currentVersion) return undefined;
  const out: MigrationStep[] = [];
  let v = currentVersion;
  const byFrom = new Map<number, MigrationStep>();
  for (const s of ctx.known) byFrom.set(s.from, s);
  while (v < targetVersion) {
    const step = byFrom.get(v);
    if (step === undefined) return undefined;
    out.push(step);
    v = step.to;
  }
  return v === targetVersion ? out : undefined;
}

export function latestVersion(ctx: MigrationContext): number {
  return ctx.known.reduce((m, s) => Math.max(m, s.to), 1);
}
