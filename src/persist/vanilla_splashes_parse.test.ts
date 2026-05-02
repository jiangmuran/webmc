import { describe, it, expect } from 'vitest';
import { parseVanillaSplashes, pickSplash } from './vanilla_splashes_parse';

describe('vanilla splashes.txt parser', () => {
  it('splits non-empty lines, trims trailing whitespace', () => {
    const p = parseVanillaSplashes('one\n  two  \n\n three');
    expect(p.lines).toEqual(['one', '  two', ' three']);
  });

  it('handles CRLF line endings', () => {
    const p = parseVanillaSplashes('alpha\r\nbeta\r\n');
    expect(p.lines).toEqual(['alpha', 'beta']);
  });

  it('returns empty array for empty input', () => {
    expect(parseVanillaSplashes('').lines).toEqual([]);
  });

  it('pickSplash picks deterministically per seed', () => {
    const p = parseVanillaSplashes('a\nb\nc\nd');
    expect(pickSplash(p, 0)).toBe('a');
    expect(pickSplash(p, 1)).toBe('b');
    expect(pickSplash(p, 5)).toBe('b');
  });

  it('pickSplash falls back when empty', () => {
    expect(pickSplash({ lines: [] }, 0, 'fallback!')).toBe('fallback!');
  });
});
