import { describe, it, expect } from 'vitest';
import {
  workerCount,
  canTransferBuffers,
  prefersSharedArrayBuffer,
  MAX_MOBILE_WORKERS,
  MIN_WORKERS,
} from './worker_pool_size';

describe('worker pool size', () => {
  it('minimum 2', () => {
    expect(workerCount({ cores: 2, isMobile: false })).toBe(MIN_WORKERS);
  });

  it('desktop N-1', () => {
    expect(workerCount({ cores: 12, isMobile: false })).toBe(11);
  });

  it('mobile cap 4', () => {
    expect(workerCount({ cores: 16, isMobile: true })).toBe(MAX_MOBILE_WORKERS);
  });

  it('transfer ok', () => {
    expect(canTransferBuffers()).toBe(true);
  });

  it('shared AB off by default', () => {
    expect(prefersSharedArrayBuffer()).toBe(false);
  });
});
