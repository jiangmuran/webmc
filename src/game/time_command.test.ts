import { describe, it, expect } from 'vitest';
import { resolveValue, apply } from './time_command';

describe('time command', () => {
  it('preset day', () => {
    expect(resolveValue('day')).toBe(1000);
  });

  it('numeric input', () => {
    expect(resolveValue('5000')).toBe(5000);
  });

  it('bad input', () => {
    expect(resolveValue('banana')).toBeUndefined();
  });

  it('set wraps', () => {
    expect(apply(0, 'set', 25000)).toBe(1000);
  });

  it('add advances', () => {
    expect(apply(100, 'add', 500)).toBe(600);
  });

  it('query does not change', () => {
    expect(apply(7777, 'query', 0)).toBe(7777);
  });
});
