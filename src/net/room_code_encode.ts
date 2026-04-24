const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export const CODE_LENGTH = 6;

export function encodeNumberToCode(n: number): string {
  let value = n;
  let out = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    out = (ALPHABET.charAt(value % ALPHABET.length) || 'A') + out;
    value = Math.floor(value / ALPHABET.length);
  }
  return out;
}

export function isValidCode(code: string): boolean {
  if (code.length !== CODE_LENGTH) return false;
  for (let i = 0; i < code.length; i++) {
    if (!ALPHABET.includes(code.charAt(i))) return false;
  }
  return true;
}

export function sanitizeUserInput(s: string): string {
  return s
    .toUpperCase()
    .replace(/[IL1OB0]/g, (c) => {
      if (c === 'I' || c === 'L' || c === '1') return 'J';
      if (c === 'O' || c === '0') return 'Q';
      if (c === 'B') return '8';
      return c;
    })
    .replace(/[^A-Z2-9]/g, '')
    .slice(0, CODE_LENGTH);
}
