// Room code encoding. 6-char uppercase base-36 string. Used in URL
// `?room=ABCDEF` to join friends without an account.

export const ROOM_CODE_LENGTH = 6;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateRoomCode(rand: () => number): string {
  let out = '';
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    const idx = Math.floor(rand() * ALPHABET.length);
    out += ALPHABET.charAt(idx);
  }
  return out;
}

export function isValidRoomCode(code: string): boolean {
  if (code.length !== ROOM_CODE_LENGTH) return false;
  for (const c of code) {
    if (!ALPHABET.includes(c)) return false;
  }
  return true;
}

export function toUrl(code: string, base = 'https://webmc.local/'): string {
  return `${base}?room=${code}`;
}

export function extractFromUrl(url: string): string | null {
  const m = /[?&]room=([A-Z0-9]{6})/.exec(url);
  return m?.[1] ?? null;
}
