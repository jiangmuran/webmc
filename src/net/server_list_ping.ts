// Server list ping. Get world metadata + current players without joining.

export interface ServerInfo {
  roomCode: string;
  hostName: string;
  version: string;
  players: number;
  maxPlayers: number;
  motd: string;
  latencyMs: number;
}

export function isCompatible(clientVersion: string, serverVersion: string): boolean {
  const [cMajor, cMinor] = clientVersion.split('.').map(Number);
  const [sMajor, sMinor] = serverVersion.split('.').map(Number);
  if (cMajor === undefined || sMajor === undefined) return false;
  if (cMajor !== sMajor) return false;
  return (cMinor ?? 0) >= (sMinor ?? 0) - 1 && (cMinor ?? 0) <= (sMinor ?? 0) + 1;
}

export function isFull(info: ServerInfo): boolean {
  return info.players >= info.maxPlayers;
}

export function formatDisplay(info: ServerInfo): string {
  return `${info.hostName} [${info.players}/${info.maxPlayers}] ${info.motd}`;
}

export const PING_TIMEOUT_MS = 3000;
