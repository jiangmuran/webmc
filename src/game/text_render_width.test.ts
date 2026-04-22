import { describe, it, expect } from 'vitest';
import { charWidth, stringWidth, wrapText, truncate } from './text_render_width';

describe('text render width', () => {
  it('i is narrow', () => {
    expect(charWidth('i')).toBeLessThan(charWidth('W'));
  });

  it('string width sums', () => {
    expect(stringWidth('hi')).toBe(charWidth('h') + charWidth('i'));
  });

  it('wrap splits words', () => {
    const w = wrapText('hello world foo bar', 30);
    expect(w.length).toBeGreaterThan(1);
  });

  it('truncate fits', () => {
    expect(truncate('very long string', 20)).toContain('…');
  });

  it('short no truncate', () => {
    expect(truncate('hi', 100)).toBe('hi');
  });
});
