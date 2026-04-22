// Gamerule registry. Each rule has a name, a type (bool or int), a
// default value, and a validator. Runtime writes validate before mutating
// the world metadata blob.

export type GameruleValue = boolean | number;

export interface GameruleDef {
  name: string;
  type: 'boolean' | 'integer';
  default: GameruleValue;
  min?: number;
  max?: number;
}

export const GAMERULES: readonly GameruleDef[] = [
  { name: 'doDaylightCycle', type: 'boolean', default: true },
  { name: 'doFireTick', type: 'boolean', default: true },
  { name: 'doMobSpawning', type: 'boolean', default: true },
  { name: 'doMobLoot', type: 'boolean', default: true },
  { name: 'doTileDrops', type: 'boolean', default: true },
  { name: 'doEntityDrops', type: 'boolean', default: true },
  { name: 'doWeatherCycle', type: 'boolean', default: true },
  { name: 'keepInventory', type: 'boolean', default: false },
  { name: 'mobGriefing', type: 'boolean', default: true },
  { name: 'naturalRegeneration', type: 'boolean', default: true },
  { name: 'showDeathMessages', type: 'boolean', default: true },
  { name: 'doImmediateRespawn', type: 'boolean', default: false },
  { name: 'doInsomnia', type: 'boolean', default: true },
  { name: 'doLimitedCrafting', type: 'boolean', default: false },
  { name: 'doPatrolSpawning', type: 'boolean', default: true },
  { name: 'doTraderSpawning', type: 'boolean', default: true },
  { name: 'doWardenSpawning', type: 'boolean', default: true },
  { name: 'drowningDamage', type: 'boolean', default: true },
  { name: 'fallDamage', type: 'boolean', default: true },
  { name: 'fireDamage', type: 'boolean', default: true },
  { name: 'freezeDamage', type: 'boolean', default: true },
  { name: 'forgiveDeadPlayers', type: 'boolean', default: true },
  { name: 'universalAnger', type: 'boolean', default: false },
  { name: 'blockExplosionDropDecay', type: 'boolean', default: true },
  { name: 'globalSoundEvents', type: 'boolean', default: true },
  { name: 'lavaSourceConversion', type: 'boolean', default: false },
  { name: 'waterSourceConversion', type: 'boolean', default: true },
  { name: 'announceAdvancements', type: 'boolean', default: true },
  { name: 'commandBlockOutput', type: 'boolean', default: true },
  { name: 'commandModificationBlockLimit', type: 'integer', default: 32768, min: 0 },
  { name: 'maxCommandChainLength', type: 'integer', default: 65536, min: 0 },
  { name: 'maxEntityCramming', type: 'integer', default: 24, min: 0 },
  { name: 'playersSleepingPercentage', type: 'integer', default: 100, min: 0, max: 100 },
  { name: 'randomTickSpeed', type: 'integer', default: 3, min: 0 },
  { name: 'snowAccumulationHeight', type: 'integer', default: 1, min: 0, max: 8 },
  { name: 'spawnChunkRadius', type: 'integer', default: 2, min: 0, max: 32 },
  { name: 'spawnRadius', type: 'integer', default: 10, min: 0 },
  { name: 'tntExplodes', type: 'boolean', default: true },
  { name: 'sendCommandFeedback', type: 'boolean', default: true },
  { name: 'logAdminCommands', type: 'boolean', default: true },
  { name: 'reducedDebugInfo', type: 'boolean', default: false },
  { name: 'projectilesCanBreakBlocks', type: 'boolean', default: true },
];

export function defOf(name: string): GameruleDef | null {
  return GAMERULES.find((g) => g.name === name) ?? null;
}

export interface ParseResult {
  ok: boolean;
  value?: GameruleValue;
  reason?: 'unknown_rule' | 'type_mismatch' | 'out_of_range';
}

export function parseRule(name: string, raw: string): ParseResult {
  const def = defOf(name);
  if (!def) return { ok: false, reason: 'unknown_rule' };
  if (def.type === 'boolean') {
    if (raw === 'true') return { ok: true, value: true };
    if (raw === 'false') return { ok: true, value: false };
    return { ok: false, reason: 'type_mismatch' };
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return { ok: false, reason: 'type_mismatch' };
  if (def.min !== undefined && n < def.min) return { ok: false, reason: 'out_of_range' };
  if (def.max !== undefined && n > def.max) return { ok: false, reason: 'out_of_range' };
  return { ok: true, value: n };
}

export function defaults(): Record<string, GameruleValue> {
  const out: Record<string, GameruleValue> = {};
  for (const g of GAMERULES) out[g.name] = g.default;
  return out;
}
