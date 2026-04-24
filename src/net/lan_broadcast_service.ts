export interface LanAnnouncement {
  motd: string;
  port: number;
  worldName: string;
  gameMode: 'survival' | 'creative' | 'adventure' | 'spectator';
}

export const LAN_MULTICAST_ADDR = '224.0.2.60';
export const LAN_PORT = 4445;
export const BROADCAST_INTERVAL_MS = 1500;

export function formatAnnouncement(a: LanAnnouncement): string {
  return `[MOTD]${a.motd}[/MOTD][AD]${a.port}[/AD]`;
}

export function parseAnnouncement(raw: string): { motd: string; port: number } | undefined {
  const motdMatch = /\[MOTD\](.*?)\[\/MOTD\]/.exec(raw);
  const adMatch = /\[AD\](\d+)\[\/AD\]/.exec(raw);
  if (motdMatch === null || adMatch === null) return undefined;
  const motd = motdMatch[1] ?? '';
  const port = Number(adMatch[1] ?? 0);
  if (port <= 0 || port > 65535) return undefined;
  return { motd, port };
}
