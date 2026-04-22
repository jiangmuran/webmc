// Chat mention detection. A message mentioning "@you" or your exact
// username triggers a notification sound + highlight.

export interface MentionDetectQuery {
  message: string;
  playerName: string;
  aliases: string[];
}

export function detectMention(q: MentionDetectQuery): boolean {
  const lower = q.message.toLowerCase();
  const candidates = [q.playerName, ...q.aliases].map((s) => s.toLowerCase());
  for (const name of candidates) {
    if (!name) continue;
    const re = new RegExp(`@?\\b${escapeRegex(name)}\\b`, 'i');
    if (re.test(lower)) return true;
  }
  return false;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Strip @mentions from message for display in log (keeps text, just
// indicating mention).
export function stripAtSigns(message: string): string {
  return message.replace(/@(\w+)/g, '$1');
}

// Suggest names starting with a token.
export function suggestNames(token: string, pool: string[]): string[] {
  if (!token) return [];
  const lower = token.toLowerCase();
  return pool.filter((n) => n.toLowerCase().startsWith(lower));
}
