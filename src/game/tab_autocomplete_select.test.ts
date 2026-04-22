import { describe, it, expect } from 'vitest';
import {
  makeSuggest,
  currentToken,
  computeSuggestions,
  cycle,
  apply,
} from './tab_autocomplete_select';

describe('autocomplete', () => {
  it('current token', () => {
    expect(currentToken('/give Ste', 9)).toEqual({ token: 'Ste', start: 6 });
  });

  it('suggestions filter', () => {
    const s = computeSuggestions('/give Ste', 9, ['Steve', 'Alex', 'Stella']);
    expect(s.sort()).toEqual(['Stella', 'Steve']);
  });

  it('cycle wraps', () => {
    const s = makeSuggest('Ste', 3);
    s.suggestions = ['Steve', 'Stella'];
    cycle(s, 1);
    expect(s.selectedIndex).toBe(0);
    cycle(s, 1);
    expect(s.selectedIndex).toBe(1);
    cycle(s, 1);
    expect(s.selectedIndex).toBe(0);
  });

  it('apply inserts choice', () => {
    const s = makeSuggest('/give Ste', 9);
    s.suggestions = ['Steve'];
    cycle(s, 1);
    expect(apply(s)).toBe('/give Steve');
  });

  it('no selection = null', () => {
    const s = makeSuggest('x', 1);
    expect(apply(s)).toBeNull();
  });
});
