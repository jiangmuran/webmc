// Parse a vanilla chat_type JSON (1.19+ datapack format). Schema:
//   {
//     "chat":     { "translation_key": <key>, "parameters": ["sender","content"] },
//     "narration":{ "translation_key": <key>, "parameters": ["sender","content"] }
//   }
//
// Each entry is a "decoration": a translation key + a list of which
// parameters to forward into the format string.
//
// Source: minecraft.wiki "Chat type". Behavioral spec — clean-room.

export type ChatTypeParameter = 'sender' | 'content' | 'target' | 'team_name';

export interface ChatTypeDecoration {
  translationKey: string;
  parameters: ChatTypeParameter[];
}

export interface ParsedChatType {
  chat: ChatTypeDecoration;
  narration: ChatTypeDecoration;
}

export class ChatTypeParseError extends Error {}

const PARAM_NAMES: ReadonlyArray<ChatTypeParameter> = ['sender', 'content', 'target', 'team_name'];

function readDecoration(v: unknown): ChatTypeDecoration {
  const def: ChatTypeDecoration = { translationKey: 'chat.type.text', parameters: [] };
  if (typeof v !== 'object' || v === null) return def;
  const o = v as Record<string, unknown>;
  const params: ChatTypeParameter[] = [];
  if (Array.isArray(o['parameters'])) {
    for (const p of o['parameters']) {
      if (typeof p === 'string' && (PARAM_NAMES as readonly string[]).includes(p)) {
        params.push(p as ChatTypeParameter);
      }
    }
  }
  return {
    translationKey:
      typeof o['translation_key'] === 'string' ? o['translation_key'] : def.translationKey,
    parameters: params,
  };
}

export function parseVanillaChatType(text: string): ParsedChatType {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new ChatTypeParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new ChatTypeParseError('chat_type must be an object');
  const o = json as Record<string, unknown>;
  return {
    chat: readDecoration(o['chat']),
    narration: readDecoration(o['narration']),
  };
}
