import { describe, it, expect } from 'vitest';
import { wrap, maxLinesShown } from './chat_line_wrap';

describe('chat line wrap', () => {
  it('short line single', () => {
    expect(wrap('hi there', 80)).toEqual(['hi there']);
  });

  it('wraps at limit', () => {
    expect(wrap('one two three', 7)).toEqual(['one two', 'three']);
  });

  it('no chars = passthrough', () => {
    expect(wrap('x', 0)).toEqual(['x']);
  });

  it('max lines 10', () => {
    expect(maxLinesShown()).toBe(10);
  });
});
