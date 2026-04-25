import { describe, it, expect } from 'vitest';
import { flattenTextComponent } from './text_component';

describe('text component flattener', () => {
  it('handles plain string', () => {
    expect(flattenTextComponent('hello')).toBe('hello');
  });

  it('handles {text: ...}', () => {
    expect(flattenTextComponent({ text: 'hi' })).toBe('hi');
  });

  it('falls back to translate key when text is missing', () => {
    expect(flattenTextComponent({ translate: 'commands.help.title' })).toBe('commands.help.title');
  });

  it('joins extra fragments', () => {
    expect(
      flattenTextComponent({
        text: 'Hello ',
        extra: [{ text: 'world' }, '!', { text: ' (', extra: [{ text: 'shout' }, ')'] }],
      }),
    ).toBe('Hello world! (shout)');
  });

  it('handles array root', () => {
    expect(flattenTextComponent([{ text: 'A' }, ' ', { text: 'B' }])).toBe('A B');
  });

  it('handles primitives in arrays', () => {
    expect(flattenTextComponent([1, ' is ', true])).toBe('1 is true');
  });

  it('returns empty string for nullish', () => {
    expect(flattenTextComponent(null)).toBe('');
    expect(flattenTextComponent(undefined)).toBe('');
  });
});
