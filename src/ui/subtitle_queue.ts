// Subtitle queue. Recent sound events displayed as text for
// accessibility. Max 5 entries; old ones fade out.

export interface SubtitleEntry {
  text: string;
  direction: 'left' | 'right' | 'center';
  expireAtMs: number;
}

export const MAX_SUBTITLES = 5;
export const SUBTITLE_LIFETIME_MS = 3000;

export interface SubtitleQueue {
  entries: SubtitleEntry[];
}

export function makeQueue(): SubtitleQueue {
  return { entries: [] };
}

export function enqueue(
  q: SubtitleQueue,
  text: string,
  direction: 'left' | 'right' | 'center',
  nowMs: number,
): void {
  q.entries.push({ text, direction, expireAtMs: nowMs + SUBTITLE_LIFETIME_MS });
  while (q.entries.length > MAX_SUBTITLES) q.entries.shift();
}

export function prune(q: SubtitleQueue, nowMs: number): void {
  q.entries = q.entries.filter((e) => e.expireAtMs > nowMs);
}

export function opacityFor(e: SubtitleEntry, nowMs: number): number {
  const remaining = e.expireAtMs - nowMs;
  if (remaining <= 0) return 0;
  if (remaining > SUBTITLE_LIFETIME_MS * 0.5) return 1;
  return remaining / (SUBTITLE_LIFETIME_MS * 0.5);
}
