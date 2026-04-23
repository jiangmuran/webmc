import { describe, it, expect } from 'vitest';
import { isExpired, isValidRoomId, refreshedToken } from './signaling_room_token';

describe('signaling room token', () => {
  const t = { roomId: 'abc123', expiresAtMs: 1000, hmac: 'x' };

  it('expired check', () => {
    expect(isExpired(t, 2000)).toBe(true);
    expect(isExpired(t, 500)).toBe(false);
  });

  it('room id format', () => {
    expect(isValidRoomId('abc123')).toBe(true);
    expect(isValidRoomId('ab')).toBe(false);
    expect(isValidRoomId('UPPER')).toBe(false);
  });

  it('refresh pushes expiry', () => {
    expect(refreshedToken(t, 5000, 10000).expiresAtMs).toBe(15000);
  });
});
