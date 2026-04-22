import { describe, it, expect } from 'vitest';
import { makeSign, edit, dye, applyGlowInk, wax, MAX_CHARS_PER_LINE } from './sign_text';

describe('sign text', () => {
  it('edits a front line', () => {
    const s = makeSign();
    expect(edit(s, { side: 'front', line: 0, text: 'hello' })).toBe(true);
    expect(s.front.lines[0]).toBe('hello');
  });

  it('truncates long lines', () => {
    const s = makeSign();
    edit(s, { side: 'back', line: 2, text: 'x'.repeat(50) });
    expect(s.back.lines[2].length).toBe(MAX_CHARS_PER_LINE);
  });

  it('dye and glow', () => {
    const s = makeSign();
    dye(s, 'front', 'red');
    applyGlowInk(s, 'front');
    expect(s.front.color).toBe('red');
    expect(s.front.glowing).toBe(true);
  });

  it('waxed blocks edits', () => {
    const s = makeSign();
    wax(s);
    expect(edit(s, { side: 'front', line: 0, text: 'x' })).toBe(false);
    expect(dye(s, 'front', 'red')).toBe(false);
    expect(applyGlowInk(s, 'front')).toBe(false);
  });
});
