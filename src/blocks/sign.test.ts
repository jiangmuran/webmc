import { describe, it, expect } from 'vitest';
import { makeSign, setSignColor, setSignLine, toggleGlow, waxSign } from './sign';

describe('sign', () => {
  it('starts with empty lines + default color', () => {
    const s = makeSign();
    expect(s.frontLines).toEqual(['', '', '', '']);
    expect(s.frontColor).toBe('#000000');
    expect(s.waxed).toBe(false);
  });

  it('setSignLine writes + clamps to 15 chars', () => {
    const s = makeSign();
    expect(setSignLine(s, 'front', 0, 'hello')).toBe(true);
    expect(s.frontLines[0]).toBe('hello');
    setSignLine(s, 'front', 1, 'this is a very long line over the limit');
    expect(s.frontLines[1].length).toBe(15);
  });

  it('waxed sign refuses further edits', () => {
    const s = makeSign();
    setSignLine(s, 'front', 0, 'first');
    waxSign(s);
    expect(setSignLine(s, 'front', 1, 'second')).toBe(false);
    expect(s.frontLines[1]).toBe('');
  });

  it('front + back are independent', () => {
    const s = makeSign();
    setSignLine(s, 'front', 0, 'A');
    setSignLine(s, 'back', 0, 'B');
    expect(s.frontLines[0]).toBe('A');
    expect(s.backLines[0]).toBe('B');
  });

  it('toggleGlow flips the glow flag', () => {
    const s = makeSign();
    expect(toggleGlow(s)).toBe(true);
    expect(s.glowing).toBe(true);
    toggleGlow(s);
    expect(s.glowing).toBe(false);
  });

  it('setSignColor works per-side', () => {
    const s = makeSign();
    setSignColor(s, 'front', '#ff0000');
    setSignColor(s, 'back', '#00ff00');
    expect(s.frontColor).toBe('#ff0000');
    expect(s.backColor).toBe('#00ff00');
  });

  it('cannot re-wax a waxed sign', () => {
    const s = makeSign();
    waxSign(s);
    expect(waxSign(s)).toBe(false);
  });
});
