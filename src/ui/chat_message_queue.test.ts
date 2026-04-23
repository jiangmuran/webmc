import { describe, it, expect } from 'vitest';
import {
  visibleLines,
  fadeOpacity,
  FADE_AFTER_MS,
  MAX_VISIBLE_LINES,
  type ChatLine,
} from './chat_message_queue';

const now = 100000;
const fresh: ChatLine = { text: 'hi', arrivedAtMs: now };
const stale: ChatLine = { text: 'old', arrivedAtMs: now - FADE_AFTER_MS - 1 };

describe('chat message queue', () => {
  it('filters stale when closed', () => {
    expect(visibleLines([stale, fresh], now, false)).toEqual([fresh]);
  });

  it('shows all when open', () => {
    expect(visibleLines([stale, fresh], now, true)).toHaveLength(2);
  });

  it('caps visible lines', () => {
    const many: ChatLine[] = Array.from({ length: 20 }, (_, i) => ({
      text: `m${i}`,
      arrivedAtMs: now,
    }));
    expect(visibleLines(many, now, false)).toHaveLength(MAX_VISIBLE_LINES);
  });

  it('fresh fully opaque', () => {
    expect(fadeOpacity(fresh, now)).toBe(1);
  });

  it('tail fades', () => {
    const nearEnd: ChatLine = { text: 'x', arrivedAtMs: now - FADE_AFTER_MS + 100 };
    const op = fadeOpacity(nearEnd, now);
    expect(op).toBeGreaterThanOrEqual(0);
    expect(op).toBeLessThan(1);
  });
});
