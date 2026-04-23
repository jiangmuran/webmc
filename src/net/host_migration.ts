// Host migration on disconnect. Deterministic new-host pick: smallest
// peer id alphabetically wins. (MVP host-leave simply ends; this stub
// covers the future migration milestone.)

export interface MigrationCtx {
  formerHostId: string;
  remainingPeers: { id: string; latencyToHostMs: number; canHost: boolean }[];
}

export function pickNewHost(c: MigrationCtx): string | null {
  const eligible = c.remainingPeers.filter((p) => p.canHost && p.id !== c.formerHostId);
  if (eligible.length === 0) return null;
  // Lowest latency wins; tie-break by id.
  eligible.sort((a, b) => a.latencyToHostMs - b.latencyToHostMs || a.id.localeCompare(b.id));
  return eligible[0]?.id ?? null;
}

export const MIGRATION_HANDSHAKE_TIMEOUT_MS = 5000;
export const MIGRATION_STATE_TRANSFER_ORDER = [
  'world_meta',
  'player_positions',
  'player_inventories',
  'entities',
  'chunk_diffs',
  'lobby',
];

export function canHostMigrate(enabled: boolean): boolean {
  return enabled;
}
