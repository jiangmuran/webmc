import { describe, it, expect } from 'vitest';
import { setLine, isEmpty, MAX_CHARS_PER_LINE } from './sign_edit';

describe('sign edit', () => {
  const blank = { lines: ['', '', '', ''] as [string, string, string, string] };

  it('sets line', () => {
    expect(setLine(blank, 0, 'hi').lines[0]).toBe('hi');
  });

  it('truncates long text', () => {
    const s = setLine(blank, 0, 'a'.repeat(40));
    expect(s.lines[0].length).toBe(MAX_CHARS_PER_LINE);
  });

  it('ignores out-of-range', () => {
    expect(setLine(blank, 5, 'x').lines).toEqual(blank.lines);
  });

  it('detects empty', () => {
    expect(isEmpty(blank)).toBe(true);
    expect(isEmpty(setLine(blank, 0, 'x'))).toBe(false);
  });
});
