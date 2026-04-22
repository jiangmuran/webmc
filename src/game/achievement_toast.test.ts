import { describe, it, expect } from 'vitest';
import {
  enqueueToast,
  makeToastState,
  sortQueueByPriority,
  tickToasts,
  type Toast,
} from './achievement_toast';

function mk(id: string, kind: Toast['kind'], t: number): Toast {
  return { id, kind, title: id, enqueuedAtSec: t };
}

describe('achievement toast', () => {
  it('first toast shows on tick', () => {
    const s = makeToastState();
    enqueueToast(s, mk('a', 'advancement_task', 0));
    const r = tickToasts(s, { nowSec: 0 });
    expect(r.justShown?.id).toBe('a');
  });

  it('toast hides after 5s', () => {
    const s = makeToastState();
    enqueueToast(s, mk('a', 'advancement_task', 0));
    tickToasts(s, { nowSec: 0 });
    const r = tickToasts(s, { nowSec: 10 });
    expect(r.justHidden).toBe('a');
  });

  it('next toast comes after previous hides', () => {
    const s = makeToastState();
    enqueueToast(s, mk('a', 'advancement_task', 0));
    enqueueToast(s, mk('b', 'advancement_task', 0));
    tickToasts(s, { nowSec: 0 });
    const r = tickToasts(s, { nowSec: 10 });
    expect(r.justHidden).toBe('a');
    expect(r.justShown?.id).toBe('b');
  });

  it('priority sort: challenges first', () => {
    const s = makeToastState();
    enqueueToast(s, mk('a', 'advancement_task', 0));
    enqueueToast(s, mk('b', 'advancement_challenge', 0));
    sortQueueByPriority(s);
    expect(s.queue[0]?.id).toBe('b');
  });

  it('empty queue = no-op tick', () => {
    const s = makeToastState();
    const r = tickToasts(s, { nowSec: 0 });
    expect(r.justShown).toBeNull();
    expect(r.justHidden).toBeNull();
  });
});
