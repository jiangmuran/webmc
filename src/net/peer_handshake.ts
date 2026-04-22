// Peer handshake. Over the signaling socket, two peers exchange an
// offer/answer + ICE candidates to open a WebRTC data channel. Once
// the channel is open, they trade a small "hello" handshake containing:
//   protocol_version, player_uuid, player_name, client_mods[]
// The host validates and either accepts or rejects with a reason.

export const PROTOCOL_VERSION = 1;

export interface ClientHello {
  protocolVersion: number;
  playerUuid: string;
  playerName: string;
  clientMods: readonly string[];
  wantsChunksRadius: number;
}

export interface ServerHello {
  accepted: boolean;
  reason?: 'bad_protocol' | 'name_taken' | 'banned' | 'server_full' | 'mod_mismatch';
  gameSeed?: string;
  spawnPos?: { x: number; y: number; z: number; dimension: string };
  serverMods?: readonly string[];
}

export interface HandshakeCtx {
  hello: ClientHello;
  maxPlayers: number;
  currentPlayers: readonly { uuid: string; name: string }[];
  bannedUuids: ReadonlySet<string>;
  requiredMods: readonly string[];
  gameSeed: string;
  spawnPos: { x: number; y: number; z: number; dimension: string };
  serverMods: readonly string[];
}

export function handleClientHello(ctx: HandshakeCtx): ServerHello {
  if (ctx.hello.protocolVersion !== PROTOCOL_VERSION) {
    return { accepted: false, reason: 'bad_protocol' };
  }
  if (ctx.bannedUuids.has(ctx.hello.playerUuid)) {
    return { accepted: false, reason: 'banned' };
  }
  if (ctx.currentPlayers.some((p) => p.name === ctx.hello.playerName)) {
    return { accepted: false, reason: 'name_taken' };
  }
  if (ctx.currentPlayers.length >= ctx.maxPlayers) {
    return { accepted: false, reason: 'server_full' };
  }
  for (const mod of ctx.requiredMods) {
    if (!ctx.hello.clientMods.includes(mod)) {
      return { accepted: false, reason: 'mod_mismatch' };
    }
  }
  return {
    accepted: true,
    gameSeed: ctx.gameSeed,
    spawnPos: ctx.spawnPos,
    serverMods: ctx.serverMods,
  };
}

// Host publishes a room code to the signaling server; peers dial into
// that code. Room codes are 6-char base32 strings, displayed to the
// user as "ABC-DEF".
export function generateRoomCode(rng: () => number): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no I, L, 1, 0 (ambiguous)
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(rng() * alphabet.length)] ?? 'A';
  }
  return `${out.slice(0, 3)}-${out.slice(3)}`;
}

export function parseRoomCode(code: string): string | null {
  const cleaned = code.replace('-', '').toUpperCase();
  if (cleaned.length !== 6) return null;
  if (!/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]+$/.test(cleaned)) return null;
  return cleaned;
}
