// Command block. Three variants: impulse (1-shot on redstone edge),
// repeating (runs every tick while powered), and chain (runs when the
// chain block behind it runs). `conditional` ties success to the
// previous block's success state.

export type CommandBlockKind = 'impulse' | 'repeating' | 'chain';

export interface CommandBlockState {
  kind: CommandBlockKind;
  command: string;
  conditional: boolean;
  needsRedstone: boolean;
  lastExecutionSucceeded: boolean;
  lastOutput: string;
  trackOutput: boolean;
  powered: boolean;
}

export function makeCommandBlock(kind: CommandBlockKind, command = ''): CommandBlockState {
  return {
    kind,
    command,
    conditional: false,
    needsRedstone: kind !== 'chain',
    lastExecutionSucceeded: false,
    lastOutput: '',
    trackOutput: true,
    powered: false,
  };
}

export interface CommandBlockTickCtx {
  redstonePowered: boolean;
  prevBlockSuccess: boolean; // for chain blocks
}

export interface CommandBlockExecRequest {
  shouldRun: boolean;
  command: string;
}

export function tickCommandBlock(
  state: CommandBlockState,
  ctx: CommandBlockTickCtx,
): CommandBlockExecRequest {
  if (state.conditional && !ctx.prevBlockSuccess) {
    return { shouldRun: false, command: state.command };
  }

  if (state.kind === 'impulse') {
    if (state.needsRedstone && !ctx.redstonePowered)
      return { shouldRun: false, command: state.command };
    const wasPowered = state.powered;
    state.powered = ctx.redstonePowered;
    if (state.needsRedstone && wasPowered) return { shouldRun: false, command: state.command };
    return { shouldRun: true, command: state.command };
  }

  if (state.kind === 'repeating') {
    state.powered = ctx.redstonePowered;
    if (state.needsRedstone && !ctx.redstonePowered)
      return { shouldRun: false, command: state.command };
    return { shouldRun: true, command: state.command };
  }

  // chain: runs iff previous block ran AND succeeded
  return { shouldRun: ctx.prevBlockSuccess, command: state.command };
}

// Record the result of an execution back into the block's state so
// downstream chain blocks can consult it.
export function recordResult(state: CommandBlockState, succeeded: boolean, output: string): void {
  state.lastExecutionSucceeded = succeeded;
  if (state.trackOutput) state.lastOutput = output;
}
