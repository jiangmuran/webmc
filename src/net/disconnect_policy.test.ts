import { describe, it, expect } from 'vitest';
import {
  isRetriable,
  shouldPauseEntity,
  userMessage,
  suggestsReturn,
  RECONNECT_GRACE_MS,
} from './disconnect_policy';

describe('disconnect policy', () => {
  it('network retriable', () => {
    expect(isRetriable('network_error')).toBe(true);
    expect(isRetriable('kicked')).toBe(false);
  });

  it('pause entity on retriable', () => {
    expect(shouldPauseEntity('network_error')).toBe(true);
    expect(shouldPauseEntity('client_quit')).toBe(false);
  });

  it('user message not empty', () => {
    expect(userMessage('host_leave').length).toBeGreaterThan(0);
  });

  it('suggest return mostly', () => {
    expect(suggestsReturn('host_leave')).toBe(true);
    expect(suggestsReturn('kicked')).toBe(false);
  });

  it('grace > 0', () => {
    expect(RECONNECT_GRACE_MS).toBeGreaterThan(0);
  });
});
