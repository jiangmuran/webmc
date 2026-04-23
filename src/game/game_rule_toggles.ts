export type GameRuleKey =
  | 'doDaylightCycle'
  | 'doMobSpawning'
  | 'doMobLoot'
  | 'doTileDrops'
  | 'doEntityDrops'
  | 'doFireTick'
  | 'keepInventory'
  | 'mobGriefing'
  | 'naturalRegeneration'
  | 'showDeathMessages'
  | 'sendCommandFeedback'
  | 'commandBlockOutput';

export type GameRules = Record<GameRuleKey, boolean>;

export const DEFAULTS: GameRules = {
  doDaylightCycle: true,
  doMobSpawning: true,
  doMobLoot: true,
  doTileDrops: true,
  doEntityDrops: true,
  doFireTick: true,
  keepInventory: false,
  mobGriefing: true,
  naturalRegeneration: true,
  showDeathMessages: true,
  sendCommandFeedback: true,
  commandBlockOutput: true,
};

export function setRule(rules: GameRules, key: GameRuleKey, value: boolean): GameRules {
  return { ...rules, [key]: value };
}
