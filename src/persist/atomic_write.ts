export interface WriteOp<T> {
  key: string;
  value: T;
}

export interface TxResult<T> {
  committed: boolean;
  snapshot: Map<string, T>;
}

export function tryCommit<T>(
  snapshot: Map<string, T>,
  ops: WriteOp<T>[],
  conflictKeys: Set<string>,
): TxResult<T> {
  if (ops.some((o) => conflictKeys.has(o.key))) {
    return { committed: false, snapshot };
  }
  const next = new Map(snapshot);
  for (const op of ops) next.set(op.key, op.value);
  return { committed: true, snapshot: next };
}
