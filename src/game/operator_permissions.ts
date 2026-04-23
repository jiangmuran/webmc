export type OpLevel = 0 | 1 | 2 | 3 | 4;

export interface Perms {
  level: OpLevel;
}

export function canKick(p: Perms): boolean {
  return p.level >= 3;
}

export function canBan(p: Perms): boolean {
  return p.level >= 3;
}

export function canGamemode(p: Perms): boolean {
  return p.level >= 2;
}

export function canCheatCommands(p: Perms): boolean {
  return p.level >= 2;
}

export function canStopServer(p: Perms): boolean {
  return p.level >= 4;
}
