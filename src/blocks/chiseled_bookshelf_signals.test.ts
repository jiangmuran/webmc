import { describe, it, expect } from 'vitest';
import { redstoneSignal, countBooks } from './chiseled_bookshelf_signals';

describe('chiseled bookshelf signals', () => {
  it('top slot signal 6', () => {
    expect(
      redstoneSignal([false, false, false, false, false, true]),
    ).toBe(6);
  });

  it('empty = 0', () => {
    expect(redstoneSignal([false, false, false, false, false, false])).toBe(0);
  });

  it('lower only', () => {
    expect(redstoneSignal([true, false, false, false, false, false])).toBe(1);
  });

  it('counts books', () => {
    expect(countBooks([true, true, false, true, false, false])).toBe(3);
  });
});
