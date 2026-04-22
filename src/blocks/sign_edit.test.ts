import { describe, it, expect } from 'vitest';
import {
  dyeFace,
  editLine,
  glowFace,
  isCommandLine,
  makeSign,
  MAX_LINE_CHARS,
  unwaxSign,
  waxSign,
} from './sign_edit';

describe('sign edit', () => {
  it('blank sign has 4 empty lines', () => {
    const s = makeSign();
    expect(s.front.lines).toEqual(['', '', '', '']);
  });

  it('edit line front', () => {
    const s = makeSign();
    editLine(s, { side: 'front', lineIndex: 0, text: 'Hello' });
    expect(s.front.lines[0]).toBe('Hello');
  });

  it('truncates long lines', () => {
    const s = makeSign();
    editLine(s, { side: 'front', lineIndex: 0, text: 'x'.repeat(50) });
    expect(s.front.lines[0].length).toBe(MAX_LINE_CHARS);
  });

  it('waxed sign rejects edits', () => {
    const s = makeSign();
    waxSign(s);
    expect(editLine(s, { side: 'front', lineIndex: 0, text: 'nope' })).toBe(false);
    expect(dyeFace(s, 'front', 'red')).toBe(false);
    expect(glowFace(s, 'front')).toBe(false);
  });

  it('shears unwax', () => {
    const s = makeSign();
    waxSign(s);
    unwaxSign(s);
    expect(s.waxed).toBe(false);
  });

  it('front + back independent', () => {
    const s = makeSign();
    editLine(s, { side: 'front', lineIndex: 0, text: 'A' });
    editLine(s, { side: 'back', lineIndex: 0, text: 'B' });
    expect(s.front.lines[0]).toBe('A');
    expect(s.back.lines[0]).toBe('B');
  });

  it('command line detection', () => {
    expect(isCommandLine('/tp 1 2 3')).toBe(true);
    expect(isCommandLine('hello')).toBe(false);
  });
});
