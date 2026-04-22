import { describe, it, expect } from 'vitest';
import { backoffFor, infoFor, isRetriable, nextBackoff } from './disconnect_reasons';

describe('disconnect reasons', () => {
  it('protocol mismatch = not retriable', () => {
    expect(isRetriable('protocol_mismatch')).toBe(false);
  });

  it('timeout = retriable', () => {
    expect(isRetriable('timeout')).toBe(true);
  });

  it('rate_limited has 30s backoff', () => {
    expect(backoffFor('rate_limited')).toBe(30);
  });

  it('info contains message key', () => {
    expect(infoFor('host_kicked').messageKey).toContain('multiplayer');
  });

  it('nextBackoff grows 1.5×', () => {
    expect(nextBackoff(10, 'timeout')).toBe(15);
  });

  it('nextBackoff caps at 5 min', () => {
    expect(nextBackoff(1000, 'timeout')).toBe(300);
  });

  it('non-retriable = Infinity backoff', () => {
    expect(nextBackoff(10, 'host_kicked')).toBe(Infinity);
  });
});
