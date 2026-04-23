import { describe, it, expect } from 'vitest';
import { completions, nextCompletion } from './chat_tab_complete';

describe('chat tab complete', () => {
  it('prefix filter', () => {
    expect(completions('st', ['stone', 'stick', 'coal'])).toEqual(['stone', 'stick']);
  });

  it('empty prefix all', () => {
    expect(completions('', ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('cycle forward', () => {
    expect(nextCompletion('stone', ['stone', 'stick'], true)).toBe('stick');
  });

  it('cycle wraps', () => {
    expect(nextCompletion('stick', ['stone', 'stick'], true)).toBe('stone');
  });

  it('reverse', () => {
    expect(nextCompletion('stone', ['stone', 'stick'], false)).toBe('stick');
  });

  it('not in list starts first', () => {
    expect(nextCompletion('carrot', ['stone', 'stick'], true)).toBe('stone');
  });
});
