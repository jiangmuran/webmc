// Game rules. Boolean and numeric flags controlling world behavior.

export interface GameRules {
  doDaylightCycle: boolean;
  doWeatherCycle: boolean;
  doMobSpawning: boolean;
  doMobLoot: boolean;
  doTileDrops: boolean;
  keepInventory: boolean;
  mobGriefing: boolean;
  naturalRegeneration: boolean;
  randomTickSpeed: number;
  spawnRadius: number;
  showDeathMessages: boolean;
  doFireTick: boolean;
  doInsomnia: boolean;
  doImmediateRespawn: boolean;
}

export function defaultRules(): GameRules {
  return {
    doDaylightCycle: true,
    doWeatherCycle: true,
    doMobSpawning: true,
    doMobLoot: true,
    doTileDrops: true,
    keepInventory: false,
    mobGriefing: true,
    naturalRegeneration: true,
    randomTickSpeed: 3,
    spawnRadius: 10,
    showDeathMessages: true,
    doFireTick: true,
    doInsomnia: true,
    doImmediateRespawn: false,
  };
}

export type GameRuleKey = keyof GameRules;

export function set<K extends GameRuleKey>(r: GameRules, key: K, value: GameRules[K]): GameRules {
  return { ...r, [key]: value };
}

export function toggle(
  r: GameRules,
  key: Extract<GameRuleKey, keyof PickBoolean<GameRules>>,
): GameRules {
  return { ...r, [key]: !r[key] };
}

type PickBoolean<T> = { [K in keyof T as T[K] extends boolean ? K : never]: T[K] };
