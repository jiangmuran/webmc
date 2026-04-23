export interface RoomToken {
  roomId: string;
  expiresAtMs: number;
  hmac: string;
}

export function isExpired(t: RoomToken, nowMs: number): boolean {
  return nowMs >= t.expiresAtMs;
}

export function isValidRoomId(roomId: string): boolean {
  return /^[a-z0-9]{4,16}$/.test(roomId);
}

export function refreshedToken(t: RoomToken, nowMs: number, durationMs: number): RoomToken {
  return { ...t, expiresAtMs: nowMs + durationMs };
}
