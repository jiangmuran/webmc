import { describe, it, expect } from 'vitest';
import { canSend, afterSend } from './chunk_upload_budget';

const base = { bytesUsedThisSecond: 0, limitBytesPerSecond: 1000, windowStartMs: 0 };

describe('chunk upload budget', () => {
  it('allows small', () => {
    expect(canSend(base, 0, 500)).toBe(true);
  });

  it('rejects large', () => {
    expect(canSend({ ...base, bytesUsedThisSecond: 800 }, 0, 500)).toBe(false);
  });

  it('resets on new window', () => {
    expect(canSend({ ...base, bytesUsedThisSecond: 999 }, 2000, 500)).toBe(true);
  });

  it('after send records', () => {
    expect(afterSend(base, 0, 300).bytesUsedThisSecond).toBe(300);
  });

  it('after send new window resets', () => {
    const next = afterSend({ ...base, bytesUsedThisSecond: 999 }, 2000, 500);
    expect(next.bytesUsedThisSecond).toBe(500);
    expect(next.windowStartMs).toBe(2000);
  });
});
