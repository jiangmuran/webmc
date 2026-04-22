import { describe, it, expect } from 'vitest';
import { startCompletion, currentSuggestion, advance, isEmpty } from './player_tab_complete';

describe('tab complete', () => {
  it('matches prefix case-insensitive', () => {
    const s = startCompletion('al', ['Alice', 'alex', 'bob']);
    expect(s.matches).toEqual(['Alice', 'alex']);
  });

  it('sorted matches', () => {
    const s = startCompletion('a', ['bob', 'ada', 'alice']);
    expect(s.matches[0]).toBe('ada');
  });

  it('advance cycles', () => {
    let s = startCompletion('a', ['alice', 'ada']);
    expect(currentSuggestion(s)).toBe('ada');
    s = advance(s);
    expect(currentSuggestion(s)).toBe('alice');
    s = advance(s);
    expect(currentSuggestion(s)).toBe('ada');
  });

  it('empty when no match', () => {
    const s = startCompletion('zz', ['alice', 'bob']);
    expect(isEmpty(s)).toBe(true);
    expect(currentSuggestion(s)).toBeNull();
  });
});
