// Command block execution. Modes: impulse (runs once when powered),
// chain (runs when linked source runs), repeat (runs every tick while
// powered). Conditional: only runs if previous in chain succeeded.

export type Mode = 'impulse' | 'chain' | 'repeat';

export interface CommandBlock {
  mode: Mode;
  conditional: boolean;
  commandText: string;
  lastSuccess: boolean;
  poweredInput: boolean;
  lastRunTick: number;
}

export function makeCommandBlock(mode: Mode, text: string): CommandBlock {
  return {
    mode,
    conditional: false,
    commandText: text,
    lastSuccess: false,
    poweredInput: false,
    lastRunTick: -1,
  };
}

export interface RunContext {
  nowTick: number;
  prevLinkSuccess?: boolean;
  runRiseEdge: boolean; // signal just went high
}

export type RunResult = 'ran' | 'skipped' | 'no_power';

export function shouldRunThisTick(b: CommandBlock, ctx: RunContext): RunResult {
  if (b.conditional && ctx.prevLinkSuccess === false) return 'skipped';
  if (b.mode === 'chain') return ctx.prevLinkSuccess ? 'ran' : 'skipped';
  if (b.mode === 'impulse') {
    if (!ctx.runRiseEdge) return 'no_power';
    return 'ran';
  }
  // repeat
  return b.poweredInput ? 'ran' : 'no_power';
}

export function markRun(b: CommandBlock, success: boolean, nowTick: number): void {
  b.lastSuccess = success;
  b.lastRunTick = nowTick;
}
