// Chat protocol. Client sends a "chat" message; host validates against
// rate limiter, rejects if body > MAX_LEN, strips control chars, broadcasts
// to all peers with sender id prepended. Commands start with "/" and are
// dispatched to the command system instead of broadcast.

export const MAX_CHAT_LEN = 256;

export interface IncomingChat {
  senderId: string;
  body: string;
  nowSec: number;
}

export interface ChatReject {
  reason: 'too_long' | 'empty' | 'rate_limited' | 'malformed';
}

export interface ChatBroadcast {
  kind: 'chat';
  senderId: string;
  body: string;
  ts: number;
}

export interface ChatCommand {
  kind: 'command';
  senderId: string;
  name: string;
  args: readonly string[];
  ts: number;
}

export type ChatResult = ChatBroadcast | ChatCommand | ChatReject;

export interface ChatAllow {
  allow: (senderId: string, nowSec: number) => boolean;
}

export function handleChat(msg: IncomingChat, limiter: ChatAllow): ChatResult {
  const trimmed = msg.body.trim();
  if (trimmed.length === 0) return { reason: 'empty' };
  if (trimmed.length > MAX_CHAT_LEN) return { reason: 'too_long' };
  // Control char filter (anything below space except tab).
  for (let i = 0; i < trimmed.length; i++) {
    const c = trimmed.charCodeAt(i);
    if (c < 32 && c !== 9) return { reason: 'malformed' };
  }
  if (!limiter.allow(msg.senderId, msg.nowSec)) {
    return { reason: 'rate_limited' };
  }
  if (trimmed.startsWith('/')) {
    const [name, ...args] = trimmed.slice(1).split(/\s+/);
    return {
      kind: 'command',
      senderId: msg.senderId,
      name: name ?? '',
      args,
      ts: msg.nowSec,
    };
  }
  return { kind: 'chat', senderId: msg.senderId, body: trimmed, ts: msg.nowSec };
}

// Formatting: chat supports §0..§f color codes like classic MC. The
// parser produces a list of runs for the UI to render. Unknown codes are
// passed through literally.

export type ColorCode =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f';

export interface ChatRun {
  color: ColorCode | null;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  text: string;
}

const VALID_COLORS = new Set('0123456789abcdef');

export function parseFormatting(msg: string): ChatRun[] {
  const runs: ChatRun[] = [];
  let cur: ChatRun = { color: null, bold: false, italic: false, underline: false, text: '' };
  for (let i = 0; i < msg.length; i++) {
    const ch = msg[i];
    if (ch === '§' && i + 1 < msg.length) {
      const code = (msg[i + 1] ?? '').toLowerCase();
      if (cur.text.length > 0) runs.push(cur);
      cur = { ...cur, text: '' };
      if (VALID_COLORS.has(code)) cur.color = code as ColorCode;
      else if (code === 'l') cur.bold = true;
      else if (code === 'o') cur.italic = true;
      else if (code === 'n') cur.underline = true;
      else if (code === 'r')
        cur = { color: null, bold: false, italic: false, underline: false, text: '' };
      i++;
    } else {
      cur.text += ch ?? '';
    }
  }
  if (cur.text.length > 0) runs.push(cur);
  return runs;
}
