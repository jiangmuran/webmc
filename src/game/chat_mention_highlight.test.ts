import { describe, it, expect } from 'vitest';
import { detectMention, stripAtSigns, suggestNames } from './chat_mention_highlight';

describe('chat mention', () => {
  it('detects name', () => {
    expect(detectMention({ message: 'hi Steve', playerName: 'Steve', aliases: [] })).toBe(true);
  });

  it('detects @name', () => {
    expect(detectMention({ message: 'look at @Steve', playerName: 'Steve', aliases: [] })).toBe(
      true,
    );
  });

  it('case insensitive', () => {
    expect(detectMention({ message: 'STEVE', playerName: 'Steve', aliases: [] })).toBe(true);
  });

  it('alias', () => {
    expect(detectMention({ message: 'hi bob', playerName: 'Steve', aliases: ['Bob'] })).toBe(true);
  });

  it('no mention', () => {
    expect(detectMention({ message: 'hello world', playerName: 'Steve', aliases: [] })).toBe(false);
  });

  it('strip @', () => {
    expect(stripAtSigns('hi @Steve and @Alex')).toBe('hi Steve and Alex');
  });

  it('suggest starts with', () => {
    const s = suggestNames('Ste', ['Steve', 'Stella', 'Alex']);
    expect(s).toEqual(['Steve', 'Stella']);
  });
});
