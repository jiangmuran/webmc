import { describe, it, expect } from 'vitest';
import { parseFormatted, stripCodes } from './chat_color_formatter';

describe('chat color formatter', () => {
  it('plain text → single segment', () => {
    expect(parseFormatted('hi')).toEqual([{ text: 'hi', format: [] }]);
  });

  it('red color applied', () => {
    const s = parseFormatted('§chello');
    expect(s[0]?.color).toBe('red');
  });

  it('bold format', () => {
    expect(parseFormatted('§lstrong')[0]?.format).toContain('bold');
  });

  it('reset clears', () => {
    const s = parseFormatted('§chello§rworld');
    expect(s[1]?.color).toBeUndefined();
  });

  it('strip removes codes', () => {
    expect(stripCodes('§chello §lworld')).toBe('hello world');
  });

  it('unknown code ignored', () => {
    expect(parseFormatted('§zhi')).toEqual([{ text: 'hi', format: [] }]);
  });
});
