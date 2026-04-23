// "BUD" (block update detector) logic. Some block state transitions
// need a neighboring block update to commit. Emulated by explicit
// BUD tests (e.g., piston quasi-connectivity).

export interface BudCtx {
  blockBelow: string;
  facingSide: string;
  aboveHasPower: boolean;
}

// Quasi-connectivity: piston activates if a block 2 blocks above it
// is powered (classic MC behavior). Not endorsed; we model explicitly.
export function quasiConnectivityFires(aboveAbovePowered: boolean): boolean {
  return aboveAbovePowered;
}

export function neighborUpdateCount(c: BudCtx): number {
  let n = 0;
  if (c.blockBelow !== 'air') n++;
  if (c.facingSide !== 'air') n++;
  if (c.aboveHasPower) n++;
  return n;
}

export function requiresBUDTrigger(blockId: string): boolean {
  return (
    blockId === 'sand' ||
    blockId === 'gravel' ||
    blockId === 'anvil' ||
    blockId.startsWith('concrete_powder')
  );
}
