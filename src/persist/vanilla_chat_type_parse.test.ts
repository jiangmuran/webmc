import { describe, it, expect } from 'vitest';
import { parseVanillaChatType, ChatTypeParseError } from './vanilla_chat_type_parse';

describe('vanilla chat_type parser', () => {
  it('parses chat + narration decorations', () => {
    const c = parseVanillaChatType(
      JSON.stringify({
        chat: { translation_key: 'chat.type.text', parameters: ['sender', 'content'] },
        narration: { translation_key: 'chat.type.text.narrate', parameters: ['sender', 'content'] },
      }),
    );
    expect(c.chat.translationKey).toBe('chat.type.text');
    expect(c.chat.parameters).toEqual(['sender', 'content']);
    expect(c.narration.translationKey).toBe('chat.type.text.narrate');
  });

  it('drops unknown parameter strings', () => {
    const c = parseVanillaChatType(
      JSON.stringify({
        chat: { translation_key: 'k', parameters: ['sender', 'frobnicator', 'content'] },
      }),
    );
    expect(c.chat.parameters).toEqual(['sender', 'content']);
  });

  it('falls back when chat or narration missing', () => {
    const c = parseVanillaChatType('{}');
    expect(c.chat.translationKey).toBe('chat.type.text');
    expect(c.chat.parameters).toEqual([]);
    expect(c.narration.translationKey).toBe('chat.type.text');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaChatType('nope')).toThrow(ChatTypeParseError);
  });
});
