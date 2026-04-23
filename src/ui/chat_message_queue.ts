export interface ChatLine {
  text: string;
  arrivedAtMs: number;
}

export const FADE_AFTER_MS = 10000;
export const MAX_VISIBLE_LINES = 10;

export function visibleLines(
  lines: readonly ChatLine[],
  nowMs: number,
  chatOpen: boolean,
): readonly ChatLine[] {
  if (chatOpen) return lines.slice(-100);
  return lines.filter((l) => nowMs - l.arrivedAtMs < FADE_AFTER_MS).slice(-MAX_VISIBLE_LINES);
}

export function fadeOpacity(line: ChatLine, nowMs: number): number {
  const age = nowMs - line.arrivedAtMs;
  if (age < FADE_AFTER_MS * 0.9) return 1;
  const tail = FADE_AFTER_MS - age;
  return Math.max(0, tail / (FADE_AFTER_MS * 0.1));
}
