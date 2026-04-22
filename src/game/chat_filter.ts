// Chat filter. Simple word-level profanity filter with allow-list bypass.
// Kept pluggable so an embed can swap the word list at runtime (e.g.
// for kid-friendly servers) or disable filtering entirely.

export interface FilterConfig {
  enabled: boolean;
  blockedWords: Set<string>; // lowercase
  replacement: string; // e.g. "***"
  caseInsensitive: boolean;
}

export function defaultFilter(): FilterConfig {
  return {
    enabled: false,
    blockedWords: new Set(),
    replacement: '****',
    caseInsensitive: true,
  };
}

export interface FilterResult {
  filtered: string;
  matchCount: number;
}

export function applyFilter(text: string, config: FilterConfig): FilterResult {
  if (!config.enabled || config.blockedWords.size === 0) {
    return { filtered: text, matchCount: 0 };
  }
  let count = 0;
  const parts = text.split(/(\s+|[.,!?])/);
  const filtered = parts
    .map((part) => {
      const key = config.caseInsensitive ? part.toLowerCase() : part;
      if (config.blockedWords.has(key)) {
        count++;
        return config.replacement;
      }
      return part;
    })
    .join('');
  return { filtered, matchCount: count };
}

// Host decision: does a message violate the filter and need to be
// dropped, or just redacted?
export interface ModerationQuery {
  config: FilterConfig;
  strictness: 'redact' | 'drop';
  text: string;
}

export type ModerationVerdict =
  | { action: 'send'; body: string }
  | { action: 'redact'; body: string }
  | { action: 'drop'; reason: 'profanity' };

export function moderate(q: ModerationQuery): ModerationVerdict {
  const r = applyFilter(q.text, q.config);
  if (r.matchCount === 0) return { action: 'send', body: q.text };
  if (q.strictness === 'drop') return { action: 'drop', reason: 'profanity' };
  return { action: 'redact', body: r.filtered };
}

// Add / remove words at runtime (admin command).
export function blockWord(config: FilterConfig, word: string): void {
  config.blockedWords.add(config.caseInsensitive ? word.toLowerCase() : word);
}

export function unblockWord(config: FilterConfig, word: string): boolean {
  return config.blockedWords.delete(config.caseInsensitive ? word.toLowerCase() : word);
}
