export interface LanDiscoveryMsg {
  roomCode: string;
  motd: string;
  hostName: string;
  portHint: number;
}

export function encode(msg: LanDiscoveryMsg): string {
  return `webmc-lan/1|${msg.roomCode}|${msg.hostName}|${msg.portHint.toString()}|${msg.motd}`;
}

export function decode(raw: string): LanDiscoveryMsg | undefined {
  if (!raw.startsWith('webmc-lan/1|')) return undefined;
  const parts = raw.split('|');
  if (parts.length < 5) return undefined;
  const [, roomCode, hostName, portHint, ...rest] = parts;
  if (!roomCode || !hostName || !portHint) return undefined;
  const port = Number(portHint);
  if (!Number.isFinite(port)) return undefined;
  return { roomCode, hostName, portHint: port, motd: rest.join('|') };
}
