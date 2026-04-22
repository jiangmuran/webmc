// OP permission levels (0..4). Commands are gated by required level.
// Level 0 = everyone; 1 = can spawn-protect override; 2 = can use
// cheat-ish commands; 3 = can ban/kick; 4 = full (stop, etc).

export type OpLevel = 0 | 1 | 2 | 3 | 4;

export interface PlayerOp {
  name: string;
  level: OpLevel;
}

export interface CommandSpec {
  name: string;
  requiredLevel: OpLevel;
}

const TABLE: CommandSpec[] = [
  { name: 'help', requiredLevel: 0 },
  { name: 'msg', requiredLevel: 0 },
  { name: 'me', requiredLevel: 0 },
  { name: 'list', requiredLevel: 0 },
  { name: 'tell', requiredLevel: 0 },
  { name: 'give', requiredLevel: 2 },
  { name: 'summon', requiredLevel: 2 },
  { name: 'time', requiredLevel: 2 },
  { name: 'weather', requiredLevel: 2 },
  { name: 'gamemode', requiredLevel: 2 },
  { name: 'teleport', requiredLevel: 2 },
  { name: 'kick', requiredLevel: 3 },
  { name: 'ban', requiredLevel: 3 },
  { name: 'op', requiredLevel: 3 },
  { name: 'deop', requiredLevel: 3 },
  { name: 'stop', requiredLevel: 4 },
  { name: 'save-all', requiredLevel: 4 },
];

export function commandLevel(name: string): OpLevel | null {
  return TABLE.find((c) => c.name === name)?.requiredLevel ?? null;
}

export function canRun(p: PlayerOp, name: string): boolean {
  const lvl = commandLevel(name);
  if (lvl === null) return false;
  return p.level >= lvl;
}

export function setOpLevel(p: PlayerOp, level: OpLevel): void {
  p.level = level;
}
