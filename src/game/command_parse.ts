// Minimal slash-command parser. Splits on whitespace while respecting
// double-quoted strings. Returns command + args or an error.

export interface CommandParsed {
  name: string;
  args: string[];
}

export type ParseResult = { ok: true; parsed: CommandParsed } | { ok: false; error: string };

export function parseCommand(input: string): ParseResult {
  const trimmed = input.trim();
  if (!trimmed.startsWith('/')) return { ok: false, error: 'not_a_command' };
  const body = trimmed.slice(1);
  const tokens: string[] = [];
  let cur = '';
  let inQuote = false;
  let escape = false;
  for (const ch of body) {
    if (escape) {
      cur += ch;
      escape = false;
      continue;
    }
    if (ch === '\\') {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inQuote = !inQuote;
      continue;
    }
    if (ch === ' ' && !inQuote) {
      if (cur.length > 0) {
        tokens.push(cur);
        cur = '';
      }
      continue;
    }
    cur += ch;
  }
  if (inQuote) return { ok: false, error: 'unterminated_quote' };
  if (cur.length > 0) tokens.push(cur);
  if (tokens.length === 0) return { ok: false, error: 'empty' };
  const name = tokens[0];
  if (!name) return { ok: false, error: 'empty' };
  return { ok: true, parsed: { name, args: tokens.slice(1) } };
}
