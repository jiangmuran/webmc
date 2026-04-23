import { describe, it, expect } from 'vitest';
import { xorBuffers, applyXor, diffSparsity, worthSendingDiff } from './chunk_diff_xor';

describe('chunk diff xor', () => {
  it('xor roundtrip', () => {
    const a = new Uint8Array([1, 2, 3, 4]);
    const b = new Uint8Array([1, 5, 3, 8]);
    const diff = xorBuffers(a, b);
    expect(Array.from(applyXor(a, diff))).toEqual(Array.from(b));
  });

  it('all-zero diff has max sparsity', () => {
    expect(diffSparsity(new Uint8Array([0, 0, 0]))).toBe(1);
  });

  it('all-nonzero diff zero sparsity', () => {
    expect(diffSparsity(new Uint8Array([1, 1, 1]))).toBe(0);
  });

  it('empty diff sparsity 1', () => {
    expect(diffSparsity(new Uint8Array())).toBe(1);
  });

  it('send diff when smaller', () => {
    const full = new Uint8Array(100);
    const diff = new Uint8Array(50);
    expect(worthSendingDiff(diff, full)).toBe(true);
  });

  it('skip diff when same size', () => {
    const full = new Uint8Array(100);
    const diff = new Uint8Array(100);
    expect(worthSendingDiff(diff, full)).toBe(false);
  });
});
