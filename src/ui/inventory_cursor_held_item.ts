export interface Stack {
  id: string;
  count: number;
  maxStack: number;
}

export interface CursorState {
  held?: Stack;
}

export function pickUpStack(
  c: CursorState,
  stack: Stack | undefined,
): { cursor: CursorState; slotAfter?: Stack } {
  if (stack === undefined) return { cursor: c };
  return { cursor: { held: stack } };
}

export function halfStack(stack: Stack): { left?: Stack; right: Stack } {
  const half = Math.ceil(stack.count / 2);
  const rem = stack.count - half;
  const out: { left?: Stack; right: Stack } = { right: { ...stack, count: half } };
  if (rem > 0) out.left = { ...stack, count: rem };
  return out;
}

export function placeOne(
  c: CursorState,
  target: Stack | undefined,
): { cursor: CursorState; slotAfter?: Stack } {
  if (c.held === undefined) return { cursor: c };
  const placed: Stack =
    target === undefined
      ? { ...c.held, count: 1 }
      : target.id === c.held.id && target.count < target.maxStack
        ? { ...target, count: target.count + 1 }
        : target;
  if (target !== undefined && target.id !== c.held.id) return { cursor: c };
  const remaining =
    c.held.count -
    (target === undefined || (target.id === c.held.id && target.count < target.maxStack) ? 1 : 0);
  const newCursor: CursorState = remaining > 0 ? { held: { ...c.held, count: remaining } } : {};
  return { cursor: newCursor, slotAfter: placed };
}
