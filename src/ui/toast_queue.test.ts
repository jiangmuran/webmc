import { describe, it, expect } from 'vitest';
import { visibleToasts, promoteNext, prune, MAX_VISIBLE, type Toast } from './toast_queue';

function make(id: string, shownAtMs?: number): Toast {
  const base: Toast = { id, title: id, kind: 'system', durationMs: 1000 };
  return shownAtMs === undefined ? base : { ...base, shownAtMs };
}

describe('toast queue', () => {
  it('nothing visible initially', () => {
    expect(visibleToasts([make('a'), make('b')], 0)).toEqual([]);
  });

  it('shown within duration visible', () => {
    expect(visibleToasts([make('a', 0)], 500)).toHaveLength(1);
  });

  it('expired hidden', () => {
    expect(visibleToasts([make('a', 0)], 9999)).toEqual([]);
  });

  it('cap visible count', () => {
    const q = Array.from({ length: 5 }, (_, i) => make(`t${i}`, 0));
    expect(visibleToasts(q, 500)).toHaveLength(MAX_VISIBLE);
  });

  it('promote fills empty slots', () => {
    const q = [make('a'), make('b'), make('c'), make('d')];
    const p = promoteNext(q, 1000);
    expect(p.filter((t) => t.shownAtMs !== undefined)).toHaveLength(MAX_VISIBLE);
  });

  it('prune drops expired', () => {
    expect(prune([make('a', 0), make('b')], 9999)).toHaveLength(1);
  });
});
