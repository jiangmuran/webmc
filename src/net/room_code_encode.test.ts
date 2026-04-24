import { describe, it, expect } from 'vitest';
import {
  encodeNumberToCode,
  isValidCode,
  sanitizeUserInput,
  CODE_LENGTH,
} from './room_code_encode';

describe('room code encode', () => {
  it('fixed length', () => {
    expect(encodeNumberToCode(12345).length).toBe(CODE_LENGTH);
  });

  it('deterministic', () => {
    expect(encodeNumberToCode(42)).toBe(encodeNumberToCode(42));
  });

  it('different numbers different codes', () => {
    expect(encodeNumberToCode(0)).not.toBe(encodeNumberToCode(1));
  });

  it('encoded code is valid', () => {
    expect(isValidCode(encodeNumberToCode(999))).toBe(true);
  });

  it('short string invalid', () => {
    expect(isValidCode('AB')).toBe(false);
  });

  it('lowercase uppercased and trimmed', () => {
    expect(sanitizeUserInput('ab c de f gh')).toHaveLength(CODE_LENGTH);
  });

  it('confusable chars replaced', () => {
    expect(sanitizeUserInput('I1LO0B').length).toBe(CODE_LENGTH);
  });
});
