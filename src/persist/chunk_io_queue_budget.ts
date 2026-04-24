export interface IOBudgetState {
  bytesThisTickRead: number;
  bytesThisTickWrite: number;
  readBudgetBytes: number;
  writeBudgetBytes: number;
}

export function canRead(s: IOBudgetState, requestBytes: number): boolean {
  return s.bytesThisTickRead + requestBytes <= s.readBudgetBytes;
}

export function canWrite(s: IOBudgetState, requestBytes: number): boolean {
  return s.bytesThisTickWrite + requestBytes <= s.writeBudgetBytes;
}

export function recordRead(s: IOBudgetState, bytes: number): IOBudgetState {
  return { ...s, bytesThisTickRead: s.bytesThisTickRead + bytes };
}

export function recordWrite(s: IOBudgetState, bytes: number): IOBudgetState {
  return { ...s, bytesThisTickWrite: s.bytesThisTickWrite + bytes };
}

export function resetTick(s: IOBudgetState): IOBudgetState {
  return { ...s, bytesThisTickRead: 0, bytesThisTickWrite: 0 };
}

export const DEFAULT_READ_BUDGET = 2 * 1024 * 1024;
export const DEFAULT_WRITE_BUDGET = 1 * 1024 * 1024;
