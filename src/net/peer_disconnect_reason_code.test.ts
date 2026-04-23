import { describe, it, expect } from 'vitest';
import { USER_VISIBLE, isRetryable } from './peer_disconnect_reason_code';

describe('peer disconnect reason code', () => {
  it('user-visible messages exist', () => {
    expect(USER_VISIBLE.user_quit).toContain('disconnect');
  });

  it('timeout retryable', () => {
    expect(isRetryable('timeout')).toBe(true);
  });

  it('banned not retryable', () => {
    expect(isRetryable('banned')).toBe(false);
  });

  it('crash retryable', () => {
    expect(isRetryable('crash')).toBe(true);
  });
});
