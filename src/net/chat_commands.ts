// Command dispatcher. A simple registry mapping command name → handler
// with argument parsers. Not as feature-rich as MC's brigadier (which
// has typed trees), but enough for the common /tp, /give, /gamemode,
// /time set, /weather, /op, /kick, /ban suite.

export type CommandArgType = 'string' | 'integer' | 'float' | 'player' | 'rest';

export interface CommandDef {
  name: string;
  aliases: readonly string[];
  args: readonly CommandArgType[];
  minOpLevel: number; // 0..4
  handler: (ctx: CommandExecCtx, args: readonly string[]) => CommandResult;
}

export interface CommandExecCtx {
  senderId: string;
  senderOpLevel: number;
  players: readonly { id: string; name: string }[];
  nowSec: number;
}

export type CommandResult =
  | { ok: true; message: string }
  | { ok: false; reason: 'unknown' | 'bad_args' | 'not_op' | 'runtime_error'; message: string };

export class CommandRegistry {
  private readonly byName = new Map<string, CommandDef>();

  register(def: CommandDef): void {
    this.byName.set(def.name, def);
    for (const a of def.aliases) this.byName.set(a, def);
  }

  list(): CommandDef[] {
    return Array.from(new Set(this.byName.values()));
  }

  dispatch(name: string, args: readonly string[], ctx: CommandExecCtx): CommandResult {
    const def = this.byName.get(name);
    if (!def) return { ok: false, reason: 'unknown', message: `Unknown command: ${name}` };
    if (ctx.senderOpLevel < def.minOpLevel) {
      return { ok: false, reason: 'not_op', message: 'You do not have permission' };
    }
    if (!validateArgs(def.args, args)) {
      return {
        ok: false,
        reason: 'bad_args',
        message: `Usage: /${def.name} ${def.args.join(' ')}`,
      };
    }
    try {
      return def.handler(ctx, args);
    } catch (err) {
      return {
        ok: false,
        reason: 'runtime_error',
        message: err instanceof Error ? err.message : 'error',
      };
    }
  }
}

function validateArgs(expected: readonly CommandArgType[], actual: readonly string[]): boolean {
  for (let i = 0; i < expected.length; i++) {
    const kind = expected[i];
    if (kind === 'rest') return true;
    const value = actual[i];
    if (value === undefined) return false;
    if (kind === 'integer' && !/^-?\d+$/.test(value)) return false;
    if (kind === 'float' && Number.isNaN(Number(value))) return false;
  }
  return actual.length >= expected.filter((k) => k !== 'rest').length;
}

// Parse "/name arg1 arg2 ..." into name + args.
export interface ParsedCommand {
  name: string;
  args: readonly string[];
}

export function parseCommand(raw: string): ParsedCommand | null {
  if (!raw.startsWith('/')) return null;
  const parts = raw.slice(1).trim().split(/\s+/);
  const name = parts.shift();
  if (!name) return null;
  return { name, args: parts };
}
