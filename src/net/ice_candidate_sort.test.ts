import { describe, it, expect } from 'vitest';
import { sorted, preferredTransport } from './ice_candidate_sort';

describe('ice candidate sort', () => {
  const cand = [
    { type: 'relay' as const, priority: 1000, foundation: 'a' },
    { type: 'host' as const, priority: 100, foundation: 'b' },
    { type: 'srflx' as const, priority: 500, foundation: 'c' },
  ];

  it('host ranks first', () => {
    expect(sorted(cand)[0]?.type).toBe('host');
  });

  it('direct transport preferred', () => {
    expect(preferredTransport(cand)).toBe('direct');
  });

  it('only relay = relay', () => {
    expect(preferredTransport([{ type: 'relay', priority: 100, foundation: 'a' }])).toBe('relay');
  });

  it('empty = relay fallback', () => {
    expect(preferredTransport([])).toBe('relay');
  });
});
