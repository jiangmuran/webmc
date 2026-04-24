export type GameRule =
  | 'keepInventory'
  | 'doDaylightCycle'
  | 'doWeatherCycle'
  | 'doMobSpawning'
  | 'doMobLoot'
  | 'doTileDrops'
  | 'doEntityDrops'
  | 'doFireTick'
  | 'doImmediateRespawn'
  | 'showDeathMessages'
  | 'naturalRegeneration'
  | 'mobGriefing'
  | 'randomTickSpeed'
  | 'spawnRadius'
  | 'maxEntityCramming'
  | 'announceAdvancements';

const DEFAULTS: Record<GameRule, boolean | number> = {
  keepInventory: false,
  doDaylightCycle: true,
  doWeatherCycle: true,
  doMobSpawning: true,
  doMobLoot: true,
  doTileDrops: true,
  doEntityDrops: true,
  doFireTick: true,
  doImmediateRespawn: false,
  showDeathMessages: true,
  naturalRegeneration: true,
  mobGriefing: true,
  randomTickSpeed: 3,
  spawnRadius: 10,
  maxEntityCramming: 24,
  announceAdvancements: true,
};

export function defaultValue(rule: GameRule): boolean | number {
  return DEFAULTS[rule];
}

export function isNumericRule(rule: GameRule): boolean {
  return typeof DEFAULTS[rule] === 'number';
}

export function allRules(): readonly GameRule[] {
  return Object.keys(DEFAULTS) as GameRule[];
}
