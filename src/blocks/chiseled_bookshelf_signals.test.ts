import { describe, it, expect } from 'vitest';
import { redstoneSignal, countBooks } from './chiseled_bookshelf_signals';

describe('chiseled bookshelf signals', () => {
  it('signal = lastInteractedSlot + 1', () => {
    expect(redstoneSignal([false, false, false, false, false, true], 5)).toBe(6);
  });

  it('null interaction = 0', () => {
    expect(redstoneSignal([false, false, false, false, false, false], null)).toBe(0);
  });

  it('lower slot last interacted', () => {
    expect(redstoneSignal([true, false, false, false, false, false], 0)).toBe(1);
  });

  it('counts books', () => {
    expect(countBooks([true, true, false, true, false, false])).toBe(3);
  });
});
