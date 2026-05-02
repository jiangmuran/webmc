// Achievement toast queue. When an advancement fires, a small panel
// slides in at the top-right corner. Multiple toasts queue; at most one
// is visible at a time; each displays for ~5 seconds.

export type ToastKind =
  | 'advancement_task'
  | 'advancement_goal'
  | 'advancement_challenge'
  | 'recipe_unlocked'
  | 'system';

export interface Toast {
  id: string; // unique per instance
  kind: ToastKind;
  title: string;
  subtitle?: string;
  iconItemId?: string;
  enqueuedAtSec: number;
}

const VISIBLE_DURATION_SEC = 5;
const ANIMATION_DURATION_SEC = 0.3;

export interface ToastState {
  queue: Toast[];
  visibleId: string | null;
  visibleShownAtSec: number;
}

export function makeToastState(): ToastState {
  return { queue: [], visibleId: null, visibleShownAtSec: 0 };
}

export function enqueueToast(state: ToastState, toast: Toast): void {
  state.queue.push(toast);
}

export interface TickCtx {
  nowSec: number;
}

export interface TickResult {
  justShown: Toast | null;
  justHidden: string | null;
}

// Reused per-call result. tickToasts fires every frame; was building
// a fresh {justShown, justHidden} literal each call. Caller reads
// fields synchronously and doesn't retain the reference (the toast
// view applies DOM writes immediately).
const SHARED_TICK_RESULT: TickResult = { justShown: null, justHidden: null };

export function tickToasts(state: ToastState, ctx: TickCtx): TickResult {
  const out = SHARED_TICK_RESULT;
  out.justShown = null;
  out.justHidden = null;

  if (state.visibleId !== null) {
    if (ctx.nowSec - state.visibleShownAtSec >= VISIBLE_DURATION_SEC + ANIMATION_DURATION_SEC) {
      out.justHidden = state.visibleId;
      state.visibleId = null;
    }
  }

  if (state.visibleId === null && state.queue.length > 0) {
    const next = state.queue.shift();
    if (next) {
      state.visibleId = next.id;
      state.visibleShownAtSec = ctx.nowSec;
      out.justShown = next;
    }
  }

  return out;
}

// Priority: challenge > goal > task > recipe > system. When the queue is
// long, reorder so challenges jump ahead.
const PRIORITY: Record<ToastKind, number> = {
  advancement_challenge: 0,
  advancement_goal: 1,
  advancement_task: 2,
  recipe_unlocked: 3,
  system: 4,
};

export function sortQueueByPriority(state: ToastState): void {
  state.queue.sort((a, b) => {
    const pa = PRIORITY[a.kind];
    const pb = PRIORITY[b.kind];
    if (pa !== pb) return pa - pb;
    return a.enqueuedAtSec - b.enqueuedAtSec;
  });
}
