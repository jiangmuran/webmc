// Parse vanilla server.properties — Java's key=value format with #
// comment lines. Used by vanilla server admins to configure ports,
// game-mode, world name, etc. Most fields don't apply to webmc's
// peer model but the file format is widely shared so we read it.
//
// Source: minecraft.wiki "Server.properties". Behavioral spec — clean-room.

export type PropertyValue = string | number | boolean;

export interface ParsedServerProperties {
  // Raw key/value map (post-coercion).
  fields: Record<string, PropertyValue>;
  // The vanilla fields webmc actually understands, lifted to typed shape.
  motd: string;
  serverPort: number;
  gamemode: 'survival' | 'creative' | 'adventure' | 'spectator';
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
  hardcore: boolean;
  pvp: boolean;
  spawnProtection: number;
  maxPlayers: number;
  viewDistance: number;
  simulationDistance: number;
  levelName: string;
  levelSeed: string;
  whiteList: boolean;
}

function coerce(s: string): PropertyValue {
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d+\.\d+$/.test(s)) return parseFloat(s);
  return s;
}

function asString(v: PropertyValue | undefined, fallback: string): string {
  return v === undefined ? fallback : typeof v === 'string' ? v : String(v);
}
function asInt(v: PropertyValue | undefined, fallback: number): number {
  if (typeof v === 'number') return Math.trunc(v);
  if (typeof v === 'string') {
    const n = parseInt(v, 10);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}
function asBool(v: PropertyValue | undefined, fallback: boolean): boolean {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v === 'true';
  return fallback;
}

const GAMEMODES: ReadonlyArray<ParsedServerProperties['gamemode']> = [
  'survival',
  'creative',
  'adventure',
  'spectator',
];
const DIFFICULTIES: ReadonlyArray<ParsedServerProperties['difficulty']> = [
  'peaceful',
  'easy',
  'normal',
  'hard',
];

function asGameMode(v: PropertyValue | undefined): ParsedServerProperties['gamemode'] {
  if (typeof v === 'string' && (GAMEMODES as readonly string[]).includes(v))
    return v as ParsedServerProperties['gamemode'];
  // Vanilla pre-1.13 used numeric IDs.
  if (typeof v === 'number' && v >= 0 && v < GAMEMODES.length) return GAMEMODES[v] ?? 'survival';
  return 'survival';
}

function asDifficulty(v: PropertyValue | undefined): ParsedServerProperties['difficulty'] {
  if (typeof v === 'string' && (DIFFICULTIES as readonly string[]).includes(v))
    return v as ParsedServerProperties['difficulty'];
  if (typeof v === 'number' && v >= 0 && v < DIFFICULTIES.length)
    return DIFFICULTIES[v] ?? 'normal';
  return 'normal';
}

export function parseServerProperties(text: string): ParsedServerProperties {
  const fields: Record<string, PropertyValue> = {};
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0 || trimmed.startsWith('#') || trimmed.startsWith('!')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1);
    if (key.length === 0) continue;
    fields[key] = coerce(value);
  }
  return {
    fields,
    motd: asString(fields['motd'], 'A webmc server'),
    serverPort: asInt(fields['server-port'], 25565),
    gamemode: asGameMode(fields['gamemode']),
    difficulty: asDifficulty(fields['difficulty']),
    hardcore: asBool(fields['hardcore'], false),
    pvp: asBool(fields['pvp'], true),
    spawnProtection: asInt(fields['spawn-protection'], 16),
    maxPlayers: asInt(fields['max-players'], 20),
    viewDistance: asInt(fields['view-distance'], 10),
    simulationDistance: asInt(fields['simulation-distance'], 10),
    levelName: asString(fields['level-name'], 'world'),
    levelSeed: asString(fields['level-seed'], ''),
    whiteList: asBool(fields['white-list'], false),
  };
}
