export interface BudgetState {
  bytesThisSecond: number;
  bytesPerSecondLimit: number;
  secondStartMs: number;
}

export function tryConsume(
  b: BudgetState,
  nowMs: number,
  bytes: number,
): {
  allowed: boolean;
  state: BudgetState;
} {
  let state = b;
  if (nowMs - state.secondStartMs >= 1000) {
    state = { ...state, bytesThisSecond: 0, secondStartMs: nowMs };
  }
  if (state.bytesThisSecond + bytes > state.bytesPerSecondLimit) {
    return { allowed: false, state };
  }
  return {
    allowed: true,
    state: { ...state, bytesThisSecond: state.bytesThisSecond + bytes },
  };
}
