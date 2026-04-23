import { describe, it, expect } from 'vitest';
import {
  generateRoomCode,
  isValidRoomCode,
  toUrl,
  extractFromUrl,
  ROOM_CODE_LENGTH,
} from './room_code';

describe('room code', () => {
  it('length 6', () => {
    expect(generateRoomCode(Math.random).length).toBe(ROOM_CODE_LENGTH);
  });

  it('valid random', () => {
    for (let i = 0; i < 50; i++) {
      expect(isValidRoomCode(generateRoomCode(Math.random))).toBe(true);
    }
  });

  it('rejects lowercase', () => {
    expect(isValidRoomCode('abcdef')).toBe(false);
  });

  it('rejects wrong length', () => {
    expect(isValidRoomCode('ABCDE')).toBe(false);
  });

  it('url builds', () => {
    expect(toUrl('ABC123')).toContain('room=ABC123');
  });

  it('extract from url', () => {
    expect(extractFromUrl('https://webmc.local/?room=XYZ789')).toBe('XYZ789');
  });

  it('extract missing', () => {
    expect(extractFromUrl('https://webmc.local/')).toBeNull();
  });
});
